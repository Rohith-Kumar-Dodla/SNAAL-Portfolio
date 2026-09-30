import {AppError} from './AppError.js';
export const success=(res,data,status=200,meta)=>res.status(status).json({success:true,data,...(meta?{meta}:{})});
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const slugify=value=>String(value).trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function pageQuery(query){const page=Math.max(1,Number(query.page)||1);const limit=Math.min(50,Math.max(1,Number(query.limit)||12));return{page,limit,skip:(page-1)*limit}}
export function assertId(id){if(!/^[a-f\d]{24}$/i.test(id))throw new AppError('Record not found',404,'NOT_FOUND')}
export function publicProjection(){return'-__v -internalNotes -refreshTokenHash -passwordHash'}
