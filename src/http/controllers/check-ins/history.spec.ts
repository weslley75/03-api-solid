import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../lib/prisma'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('History Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -20.9275038,
        longitude: -46.9843922,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          userId: user.id,
          gymId: gym.id,
        },
        {
          userId: user.id,
          gymId: gym.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ userId: user.id, gymId: gym.id }),
      expect.objectContaining({ userId: user.id, gymId: gym.id }),
    ])
  })
})
