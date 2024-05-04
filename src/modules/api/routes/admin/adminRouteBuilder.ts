import { Router } from "express";
import { Model } from "mongoose";

import { IdError, RequestParamIdError } from "classes/htmlErrors";
import UnknownDatabaseError from "classes/htmlErrors/UnknownDatabaseError";
import ListDataResponse from "classes/htmlSuccesses/ListDataResponse";
import SingleDataResponse from "classes/htmlSuccesses/SingleDataResponse";

import restrictedNext from "modules/api/utility/restrictedNext";
import restrictedResponse from "modules/api/utility/restrictedResponse";

/* 
type ZodSchemaType<T> = z.ZodObject<{
  [K in keyof T]: T[K] extends object[]
    ? z.ZodArray<z.ZodString> | z.ZodType<T[K]>
    : T[K] extends object
      ? z.ZodString | z.ZodType<T[K]>
      : z.ZodType<T[K]>;
}>;
 */

export default <T>(
  model: Model<T>,
  getService: () => Promise<T[]>,
  getByIdService: (id: string) => Promise<T | null>
) => {
  const route = Router();

  route.get("/", async (req, res, next) => {
    let data: T[];
    try {
      data = await getService();
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    restrictedResponse(res, new ListDataResponse(data));
  });

  route.get("/:id", async (req, res, next) => {
    const paramId = req.params.id;
    if (!paramId) return restrictedNext(next, new RequestParamIdError());

    let data: T | null;
    try {
      data = await getByIdService(paramId);
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }
    if (!data) return restrictedNext(next, new IdError(paramId));

    restrictedResponse(res, new SingleDataResponse(data));
  });

  route.post("/", async (req, res, next) => {
    let dbId: string | undefined;
    try {
      const data = await model.create(req.body);
      dbId = data._id?.toString();
    } catch (error) {
      return restrictedNext(next, new UnknownDatabaseError());
    }

    restrictedResponse(res, new SingleDataResponse(dbId));
  });

  route.patch("/:id", async (req, res, next) => {
    const paramId = req.params.id;
    if (!paramId) return restrictedNext(next, new RequestParamIdError());

    let dbId: string | undefined;
    try {
      const data = await model.findByIdAndUpdate(paramId, req.body);
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
