import { Router } from "express";
import { Model } from "mongoose";
import { z } from "zod";

import {
  IdError,
  RequestBodyError,
  RequestParamIdError,
} from "classes/htmlErrors";
import UnknownDatabaseError from "classes/htmlErrors/UnknownDatabaseError";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

export default <T>(
  model: Model<T>,
  zodSchema: z.ZodObject<z.ZodRawShape & { [K in keyof T]: z.ZodType<T[K]> }>
) => {
  const route = Router();

  route.get("/", async (req, res, next) => {
    let data: Model<T>[];
    try {
      data = await model.find();
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    restrictedResponse(res, new ListDataResponse(data));
  });

  route.get("/:id", async (req, res, next) => {
    const paramId = req.params.id;
    if (!paramId) return restrictedNext(next, new RequestParamIdError());

    let data: Model<T> | null;
    try {
      data = await model.findById(paramId);
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }
    if (!data) return restrictedNext(next, new IdError(paramId));

    restrictedResponse(res, new SingleDataResponse(data));
  });

  route.post("/", async (req, res, next) => {
    const reqBody = zodSchema.safeParse(req.body);
    if (!reqBody.success) {
      const error = new RequestBodyError(reqBody.error);
      return restrictedNext(next, error);
    }

    let dbId: string | undefined;
    try {
      const data = await model.create(reqBody.data);
      dbId = data._id?.toString();
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    restrictedResponse(res, new SingleDataResponse(dbId));
  });

  route.patch("/:id", async (req, res, next) => {
    const paramId = req.params.id;
    if (!paramId) return restrictedNext(next, new RequestParamIdError());

    const reqBody = zodSchema.partial().safeParse(req.body);
    if (!reqBody.success) {
      const error = new RequestBodyError(reqBody.error);
      return restrictedNext(next, error);
    }

    let dbId: string | undefined;
    try {
      const data = await model.findByIdAndUpdate(paramId, reqBody.data);
      if (!data) return restrictedNext(next, new IdError(paramId));

      dbId = data._id?.toString();
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    restrictedResponse(res, new SingleDataResponse(dbId));
  });

  route.delete("/:id", async (req, res, next) => {
    const paramId = req.params.id;
    if (!paramId) return restrictedNext(next, new RequestParamIdError());

    try {
      await model.findByIdAndDelete(paramId);
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    restrictedResponse(res, new SingleDataResponse(null));
  });

  return route;
};
