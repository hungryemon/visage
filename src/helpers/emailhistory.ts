import mongoose from 'mongoose'
import {Emailhistory} from '../models/emailhistory'


 export const createEmailhistory = async (body: Record<string,any>) => {
    try {
      const data = await new Emailhistory(body).save();
      return data;
    } catch (err) {
      if (typeof err == "string") throw err;
      console.log("ERROR createEmailhistory", err);
      return null;
    }
  }

 export const updateEmailhistory = async (filter: Object, body: Record<string,any>) => {
    try {
      const updated = await Emailhistory.findOneAndUpdate(filter, body, { new: true });
      return updated;
    } catch (err) {
      if (typeof err == "string") throw err;
      console.log("ERROR updateEmailhistory", err);
      return null;
    }
  }

  export const getEmailhistory = async (filter: Object) => {
    try {
      const data = await Emailhistory.findOne(filter);
      return data;
    } catch (err) {
      if (typeof err == "string") throw err;
      console.log("ERROR getEmailhistory", err);
      return null;
    }
  }

  

