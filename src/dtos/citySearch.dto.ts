import Joi from 'joi';

export const citySearchSchema = Joi.object({
  city: Joi.string().required(),
  checkInDate: Joi.string().isoDate().required(),
  checkOutDate: Joi.string().isoDate().required(),
});
