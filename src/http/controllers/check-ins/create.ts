import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '../../../use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90, {
      message: 'Latitude must be between -90 and 90.',
    }),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180, {
      message: 'Longitude must be between -180 and 180.',
    }),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const checkInUsecase = makeCheckInUseCase()

  await checkInUsecase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    gymId,
    userId: request.user.sub,
  })

  return reply.status(201).send()
}
