import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '../../utils/get-distance-between-coordinates'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const item = this.items.find((item) => item.id === id)

    return item || null
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const items = this.items.filter((item) => {
      return item.title.includes(query)
    })

    return items.slice((page - 1) * 20, page * 20)
  }
}
