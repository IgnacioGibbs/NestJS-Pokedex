import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async executeSeed() {
    try {
      await this.pokemonModel.deleteMany({}); // Delete * documents

      fetch('https://pokeapi.co/api/v2/pokemon?limit=1279')
        .then((response) => response.json())
        .then(async (data) => {
          const pokemonToInsert: { name: string; no: number }[] = [];

          data.results.forEach(({ name, url }) => {
            const contents = url.split('/');
            const no = +contents[contents.length - 2];

            pokemonToInsert.push({ name, no });
          });

          await this.pokemonModel.insertMany(pokemonToInsert);
        });

      return 'Seed completed';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
