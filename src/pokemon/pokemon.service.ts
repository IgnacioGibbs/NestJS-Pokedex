import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  private defaultSkip: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('queryLimitDefault');
    this.defaultSkip = configService.get<number>('querySkipDefault');
  }

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

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, skip = this.defaultSkip } =
      paginationDto;
    const pokemons = await this.pokemonModel
      .find()
      .limit(limit)
      .skip(skip)
      .sort({ no: 1 }) // Ordena los resultados por el campo no de forma ascendente;
      .select('-__v'); // Excluye el campo __v de los resultados;

    if (!pokemons.length)
      throw new NotFoundException(`There are no pokemons in the database`);

    return {
      message: `${limit} pokemons have been found from the ${skip}`,
      limit: limit,
      skip: skip,
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
