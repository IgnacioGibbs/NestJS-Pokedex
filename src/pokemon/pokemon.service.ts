import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return {
        message: 'A new pokemon has been created',
        pokemon,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const pokemons = await this.pokemonModel.find();

    if (!pokemons.length)
      throw new NotFoundException(`There are no pokemons in the database`);

    return {
      message: 'All pokemons',
      pokemons,
    };
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // Búsqueda por numero
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    // Búsqueda por MongoID

    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    // Búsqueda por nombre

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon whit id, name or no: ${term} not found`,
      );

    return {
      message: `The pokemon with the term #${term} has been found`,
      pokemon,
    };
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.pokemon.updateOne(updatePokemonDto);

      return {
        message: `The pokemon with the term #${term} has been updated`,
        ...pokemon.pokemon.toJSON(),
        ...updatePokemonDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (!deletedCount)
      throw new NotFoundException(`Pokemon with id: ${id} not found`);

    return {
      message: `The pokemon with the id #${id} has been deleted`,
    };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon already exists in the database ${JSON.stringify(
          error.keyValue,
        )}`,
      );
    console.log(error);
    throw new InternalServerErrorException(
      `Can't update the pokemon - Check the logs`,
    );
  }
}
