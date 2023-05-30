import { GraphQLFormattedError } from "graphql";

export const clientFormatError = ((formattedError: GraphQLFormattedError, error: unknown) => {
    let resultMsg = 'unknown error';
    const msg = formattedError.message.toLowerCase();

    // unique key constainer
    if (msg.includes("key constraint")) {
        if (msg.includes("`clientid`")) resultMsg = "The user is not exist";
        else if (msg.includes("`productsn`") || msg.includes("`product_sn`")) resultMsg = "Product serial number is not found";
    } else if(msg.includes("unique constraint")) {
        if (msg.includes("`client_user_key`")) resultMsg = "user is already exist";
        else if (msg.includes("`admin_user_key`")) resultMsg = "admin user is already exist";
        else if (msg.includes("`client_phone_key`")) resultMsg = "phone is belong to existing user";
        else if (msg.includes("`client_email_key`")) resultMsg = "email is belong to existing user";
        else if (msg.includes("`category_name_key`")) resultMsg = "category name is already exist";
        else if (msg.includes("`product_name_model_key`")) resultMsg = "the product name and model is already exist";
        else if (msg.includes("`offer_order_id_key`")) resultMsg = "the order of this offer is already exist";
    } 
    else if (msg.includes("delete()") && msg.includes("depends on one or more")) resultMsg = "Cann't delete this item becuase it is related to other data, delete the related data first";
    else if (msg.includes("delete()")) resultMsg = 'error while delete data';
    else if (msg.includes("create()")) resultMsg = 'error while creating data'
    else if (msg.includes("update()")) resultMsg = 'error while saving data';
    else if (msg.includes("upsert()")) resultMsg = 'error while manipulating data';
    if (resultMsg == "") resultMsg = formattedError.message;
    return { message: resultMsg + " : " + formattedError.message  };
  })