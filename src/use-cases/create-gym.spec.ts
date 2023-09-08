import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 01',
      description: null,
      phone: null,
      latitude: -20.9275038,
      longitude: -46.9843922,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
