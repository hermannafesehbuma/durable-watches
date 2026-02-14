import supabase from '../lib/supabase';
// Remove this import
// import { revalidatePath } from 'next/cache';

export async function getAllProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_images(url, alt_text, is_primary, url)')
    .eq('product_images.is_primary', true);
  console.log(`data: ${products}`);

  return { data: products, error };
}

// New function to fetch all products with their primary images
export async function getAllProductsWithImages() {
  const { data: products, error } = await supabase.from('products').select(`
    *,
  `);

  console.log(`data: ${products}`);

  if (error) {
    return { data: null, error };
  }

  return { data: products, error };
}
// New function to fetch a single product by ID
export async function getProductById(productId: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  return { data: product, error };
}

// New function to fetch product images by productId (foreign key)
export async function getProductImages(productId: string) {
  console.log('Fetching images for productId:', productId);

  const { data: images, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('is_primary', { ascending: false });
  // Removed the .order('created_at', { ascending: true }) line

  console.log('Images result:', { images, error });
  console.log('Error details:', error);

  return { data: images, error };
}

// New function to fetch multiple products by IDs with their primary images
export async function getCartProductsWithImages(productIds: string[]) {
  if (productIds.length === 0) {
    return { data: [], error: null };
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images!inner(
        id,
        image_url,
        alt_text,
        is_primary
      )
    `
    )
    .in('id', productIds)
    .eq('product_images.is_primary', true);

  if (error) {
    console.error('Error fetching cart products with images:', error);
    return { data: null, error };
  }

  // Transform the data to flatten the primary image
  const transformedProducts =
    products?.map((product) => ({
      ...product,
      primary_image: product.product_images?.[0] || null,
      product_images: undefined, // Remove the nested array
    })) || [];

  return { data: transformedProducts, error: null };
}

// Function to fetch primary images for cart products
export async function getProductPrimaryImages(productIds: string[]) {
  if (productIds.length === 0) {
    return { data: [], error: null };
  }

  const { data: images, error } = await supabase
    .from('product_images')
    .select('product_id, url, alt_text')
    .in('product_id', productIds)
    .eq('is_primary', true);

  if (error) {
    console.error('Error fetching primary images:', error);
    return { data: null, error };
  }

  return { data: images, error: null };
}

// Function to fetch random products with primary images
export async function getRandomProducts(limit: number = 4) {
  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images!inner(
        id,
        url,
        alt_text,
        is_primary
      )
    `
    )
    .eq('product_images.is_primary', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching random products:', error);
    return { data: null, error };
  }

  // Transform the data to flatten the primary image
  const transformedProducts =
    products?.map((product) => ({
      ...product,
      primary_image: product.product_images?.[0] || null,
      product_images: undefined, // Remove the nested array
    })) || [];

  // Shuffle the products to make them random
  const shuffledProducts = transformedProducts.sort(() => Math.random() - 0.5);

  return { data: shuffledProducts.slice(0, limit), error: null };
}

// Function to update a product
export async function updateProduct(
  productId: string,
  productData: {
    name?: string;
    price?: number;
    description?: string;
    category_id?: string; // Changed from category to category_id
    stock_quantity?: number;
  }
) {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId)
    .select()
    .single();

  return { data, error };
}

// Function to delete a product
export async function deleteProduct(productId: string) {
  // First delete associated images
  const { error: imageError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (imageError) {
    return { data: null, error: imageError };
  }

  // Then delete the product
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .select()
    .single();

  return { data, error };
}

// Function to create a new product
export async function createProduct(productData: {
  name: string;
  price: number;
  description?: string;
  category_id?: string; // Changed from category to category_id
  stock_quantity?: number;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  return { data, error };
}

// Function to upload product image to watchesrolex bucket
export async function uploadProductImage(file: File, productId: string) {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  // Organize images in folders by product_id for better organization
  const filePath = `${productId}/${fileName}`;

  // Determine the correct content type based on file extension
  let contentType = 'image/jpeg'; // default
  if (fileExt === 'png') contentType = 'image/png';
  else if (fileExt === 'webp') contentType = 'image/webp';
  else if (fileExt === 'gif') contentType = 'image/gif';
  else if (fileExt === 'jpg' || fileExt === 'jpeg') contentType = 'image/jpeg';

  // Upload to the 'watchesrolex' storage bucket with explicit content type
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('watchesrolex')
    .upload(filePath, file, {
      contentType: contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return { data: null, error: uploadError };
  }

  // Generate public URL for the uploaded image
  const {
    data: { publicUrl },
  } = supabase.storage.from('watchesrolex').getPublicUrl(filePath);

  return {
    data: {
      path: filePath,
      url: publicUrl,
      fileName: fileName,
    },
    error: null,
  };
}

// Function to add product image record to product_images table
export async function addProductImage(imageData: {
  product_id: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}) {
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: imageData.product_id,
      url: imageData.url,
      alt_text: imageData.alt_text || '',
      is_primary: imageData.is_primary || false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding product image record:', error);
  }

  return { data, error };
}

// Function to upload multiple images and create records
export async function uploadProductImages(
  files: FileList | File[],
  productId: string,
  primaryImageIndex: number = 0
) {
  const uploadedImages = [];
  const errors = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Step 1: Upload image to storage bucket
      const { data: uploadData, error: uploadError } = await uploadProductImage(
        file,
        productId
      );

      if (uploadError) {
        errors.push({ file: file.name, error: uploadError });
        continue;
      }

      if (uploadData) {
        // Step 2: Insert image metadata into product_images table
        const { data: imageRecord, error: dbError } = await addProductImage({
          product_id: productId,
          url: uploadData.url,
          alt_text: file.name.split('.')[0], // Use filename without extension as alt text
          is_primary: i === primaryImageIndex, // Set primary based on index
        });

        if (dbError) {
          errors.push({ file: file.name, error: dbError });
        } else {
          uploadedImages.push({
            ...imageRecord,
            uploadData,
          });
        }
      }
    }

    return {
      data: uploadedImages,
      errors: errors.length > 0 ? errors : null,
      success: uploadedImages.length > 0,
    };
  } catch (error) {
    console.error('Error in bulk image upload:', error);
    return {
      data: [],
      errors: [{ file: 'bulk_upload', error }],
      success: false,
    };
  }
}

// Function to delete product image from storage and database
export async function deleteProductImage(imageId: string) {
  try {
    // First get the image record to get the file path
    const { data: imageRecord, error: fetchError } = await supabase
      .from('product_images')
      .select('url, product_id')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      return { data: null, error: fetchError };
    }

    // Extract file path from URL for storage deletion
    const url = new URL(imageRecord.url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get product_id/filename

    // Delete from storage bucket
    const { error: storageError } = await supabase.storage
      .from('watchesrolex')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { data, error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error in deleteProductImage:', error);
    return { data: null, error };
  }
}

// Function to set primary image (ensures only one primary per product)
export async function setPrimaryImage(productId: string, imageId: string) {
  try {
    // First, set all images for this product to non-primary
    const { error: resetError } = await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId);

    if (resetError) {
      return { data: null, error: resetError };
    }

    // Then set the selected image as primary
    const { data, error } = await supabase
      .from('product_images')
      .update({ is_primary: true })
      .eq('id', imageId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error setting primary image:', error);
    return { data: null, error };
  }
}

// Function to get all categories
export async function getAllCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return { data: categories, error };
}

// Function to get all orders with comprehensive data for admin
export async function getAllOrdersForAdmin() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      total,
      payment_method,
      email,
      created_at,
      status
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return { data: null, error };
  }

  return { data: orders, error: null };
}

// Function to get order sTATUS

export async function getOrderStatus(statusId: number) {
  console.log('Fetching status for ID:', statusId);

  const { data: statusData, error } = await supabase
    .from('order_status')
    .select('*')
    .eq('id', statusId)
    .single();

  console.log('Status query result:', { statusData, error });

  if (error) {
    console.error('Error fetching order status:', error);
    return { data: null, error };
  }

  console.log('Final status data:', statusData);
  return { data: statusData, error: null };
}

// Function to get shipping address by order ID
export async function getShippingAddressByOrderId(orderId: string) {
  const { data: address, error } = await supabase
    .from('shipping_addresses')
    .select(
      `
      full_name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      phone
    `
    )
    .eq('order_id', orderId)
    .single();

  if (error) {
    console.error('Error fetching shipping address:', error);
    return { data: null, error };
  }

  return { data: address, error: null };
}

// Function to get order items with product details and images by order ID
export async function getOrderItemsByOrderId(orderId: string) {
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(
      `
      quantity,
      products(
        id,
        name,
        price,
        product_images!inner(
          url,
          alt_text,
          is_primary
        )
      )
    `
    )
    .eq('order_id', orderId)
    .eq('products.product_images.is_primary', true);

  if (error) {
    console.error('Error fetching order items:', error);
    return { data: null, error };
  }

  // Transform the data to flatten the structure
  const transformedItems =
    orderItems?.map((item: any) => {
      // Since products is joined, it should be a single object, not an array
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      return {
        quantity: item.quantity,
        product: {
          ...product,
          primary_image: product?.product_images?.[0] || null,
          product_images: undefined,
        },
      };
    }) || [];

  return { data: transformedItems, error: null };
}

// Function to get complete order details with all related data
export async function getCompleteOrderDetails(orderId: string) {
  try {
    // Fetch order basic info
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        id,
        total,
        payment_method,
        email,
        created_at,
        status
      `
      )
      .eq('id', orderId)
      .single();

    if (orderError) {
      return { data: null, error: orderError };
    }

    console.log('Order data:', order);
    console.log('Status from order:', order.status);

    // Fetch shipping address
    const { data: shippingAddress, error: addressError } =
      await getShippingAddressByOrderId(orderId);

    // Fetch order items with products and images
    const { data: orderItems, error: itemsError } =
      await getOrderItemsByOrderId(orderId);

    if (addressError || itemsError) {
      console.error('Error fetching related data:', {
        addressError,
        itemsError,
      });
    }

    const result = {
      ...order,
      shipping_address: shippingAddress,
      order_items: orderItems || [],
    };

    console.log('Complete order details result:', result);

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching complete order details:', error);
    return { data: null, error };
  }
}

// Function to get all orders with complete details for admin dashboard
export async function getAllOrdersWithDetailsForAdmin() {
  try {
    // First get all orders
    const { data: orders, error: ordersError } = await getAllOrdersForAdmin();

    if (ordersError || !orders) {
      return { data: null, error: ordersError };
    }

    // Fetch complete details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const { data: completeOrder } = await getCompleteOrderDetails(order.id);
        // If getCompleteOrderDetails fails, create a fallback object with required properties
        return (
          completeOrder || {
            ...order,
            shipping_address: null,
            order_items: [],
          }
        );
      })
    );

    return { data: ordersWithDetails, error: null };
  } catch (error) {
    console.error('Error fetching orders with details:', error);
    return { data: null, error };
  }
}

// Function to get all products for admin with comprehensive data
export async function getAllProductsForAdmin() {
  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images(
        id,
        url,
        alt_text,
        is_primary
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products for admin:', error);
    return { data: null, error };
  }

  return { data: products, error: null };
}

// Function to upload product video to watchesrolex bucket
export async function uploadProductVideo(file: File, productId: string) {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  // Organize videos in folders by product_id for better organization
  const filePath = `${productId}/videos/${fileName}`;

  // Determine the correct content type based on file extension
  let contentType = 'video/mp4'; // default
  if (fileExt === 'webm') contentType = 'video/webm';
  else if (fileExt === 'mov') contentType = 'video/quicktime';
  else if (fileExt === 'avi') contentType = 'video/x-msvideo';
  else if (fileExt === 'mkv') contentType = 'video/x-matroska';
  else if (fileExt === 'mp4') contentType = 'video/mp4';

  // Upload to the 'watchesrolex' storage bucket with explicit content type
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('watchesrolex')
    .upload(filePath, file, {
      contentType: contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error('Video upload error:', uploadError);
    return { data: null, error: uploadError };
  }

  // Generate public URL for the uploaded video
  const {
    data: { publicUrl },
  } = supabase.storage.from('watchesrolex').getPublicUrl(filePath);

  return {
    data: {
      path: filePath,
      url: publicUrl,
      fileName: fileName,
    },
    error: null,
  };
}

// Function to upload multiple media files (images and videos) and create records
export async function uploadProductMedia(
  files: FileList | File[],
  productId: string,
  primaryMediaIndex: number = 0
) {
  const uploadedMedia = [];
  const errors = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');

      // Step 1: Upload media to storage bucket
      const { data: uploadData, error: uploadError } = isVideo
        ? await uploadProductVideo(file, productId)
        : await uploadProductImage(file, productId);

      if (uploadError) {
        errors.push({ file: file.name, error: uploadError });
        continue;
      }

      if (uploadData) {
        // Step 2: Insert media metadata into product_images table
        // Note: We use the same table for both images and videos
        const { data: mediaRecord, error: dbError } = await addProductImage({
          product_id: productId,
          url: uploadData.url,
          alt_text: file.name.split('.')[0],
          is_primary: i === primaryMediaIndex,
        });

        if (dbError) {
          errors.push({ file: file.name, error: dbError });
        } else {
          uploadedMedia.push({
            ...mediaRecord,
            uploadData,
            type: isVideo ? 'video' : 'image',
          });
        }
      }
    }

    return {
      data: uploadedMedia,
      errors: errors.length > 0 ? errors : null,
      success: uploadedMedia.length > 0,
    };
  } catch (error) {
    console.error('Error in bulk media upload:', error);
    return {
      data: [],
      errors: [{ file: 'unknown', error }],
      success: false,
    };
  }
}

// Function to create a new order
export async function createOrder(orderData: {
  total: number;
  payment_method: string;
  email: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      status: orderData.status || 'pending',
    })
    .select()
    .single();

  return { data, error };
}

// Function to create shipping address
export async function createShippingAddress(addressData: {
  order_id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from('shipping_addresses')
    .insert(addressData)
    .select()
    .single();

  return { data, error };
}

// Function to create order items
export async function createOrderItems(
  orderItems: {
    order_id: string;
    product_id: string;
    quantity: number;
    price: number; // This is price_at_time
  }[]
) {
  // Map the price field to price_at_time for database insertion
  const mappedOrderItems = orderItems.map((item) => ({
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_time: item.price, // Map price to price_at_time
  }));

  const { data, error } = await supabase
    .from('order_items')
    .insert(mappedOrderItems)
    .select();

  return { data, error };
}

// Function to create complete order with all related data
export async function createCompleteOrder(orderData: {
  // Order details
  total: number;
  payment_method: string;
  email: string;
  status?: string;
  // Shipping address
  shipping: {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    country: string;
    postal_code?: string;
    phone?: string;
  };
  // Order items
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}) {
  try {
    // Step 1: Create the order
    const { data: order, error: orderError } = await createOrder({
      total: orderData.total,
      payment_method: orderData.payment_method,
      email: orderData.email,
      status: orderData.status,
    });

    if (orderError || !order) {
      return { data: null, error: orderError };
    }

    // Step 2: Create shipping address
    const { data: shippingAddress, error: shippingError } =
      await createShippingAddress({
        order_id: order.id,
        ...orderData.shipping,
      });

    if (shippingError) {
      console.error('Error creating shipping address:', shippingError);
      // Continue even if shipping address fails
    }

    // Step 3: Create order items
    const orderItemsData = orderData.items.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { data: orderItems, error: itemsError } =
      await createOrderItems(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Continue even if some items fail
    }

    return {
      data: {
        order,
        shipping_address: shippingAddress,
        order_items: orderItems,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error creating complete order:', error);
    return { data: null, error };
  }
}

// Function to update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  // Remove these revalidatePath calls
  // if (!error) {
  //   revalidatePath('/admin/orders');
  //   revalidatePath('/admin');
  // }

  return { data, error };
}

// Function to search products by name or description
export async function searchProducts(searchTerm: string) {
  if (!searchTerm.trim()) {
    return { data: [], error: null };
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images!inner(
        id,
        url,
        alt_text,
        is_primary
      )
    `
    )
    .eq('product_images.is_primary', true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching products:', error);
    return { data: null, error };
  }

  // Transform the data to flatten the primary image
  const transformedProducts =
    products?.map((product) => ({
      ...product,
      primary_image: product.product_images?.[0] || null,
      product_images: undefined, // Remove the nested array
    })) || [];

  return { data: transformedProducts, error: null };
}
