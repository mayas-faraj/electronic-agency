import { rule, shield } from 'graphql-shield';
import { AppContext } from './auth';

const ruleCreator = rule();
const isClient = ruleCreator(async (parent:any , args: any, context: AppContext) => {
    return context.user.rol == null || context.user.rol === "";
});

const isAdmin = ruleCreator(async (parent:any , args: any, context: AppContext) => {
    return context.user.rol === "ADMIN";
});

const isProductManager = ruleCreator(async (parent:any , args: any, context: AppContext) => {
    return context.user.rol === "PRODUCT_MANAGER";
});

const isSalesMan = ruleCreator(async (parent:any , args: any, context: AppContext) => {
    return context.user.rol === "SALES_MAN";
});

const isTechnical = ruleCreator(async (parent:any , args: any, context: AppContext) => {
    return context.user.rol === "TECHNICAL";
});

const permissions = shield({
    Query: {
        client: isClient
    }
});