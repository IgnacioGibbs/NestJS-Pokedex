import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}
  async executeSeed() {
    try {
      await this.pokemonModel.deleteMany({}); // Delete * documents

      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=1279',
      );

      const pokemonToInsert: { name: string; no: number }[] = [];

      data.results.forEach(({ name, url }) => {
        const contents = url.split('/');
        const no = +contents[contents.length - 2];

        pokemonToInsert.push({ name, no });
      });

      await this.pokemonModel.insertMany(pokemonToInsert);

      return 'Seed completed';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
