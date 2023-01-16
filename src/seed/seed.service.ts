import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  async executeSeed() {
    try {
      const data = fetch('https://pokeapi.co/api/v2/pokemon?limit=1279')
        .then((response) => response.json())
        .then((data) => {
          data.results.forEach(({ name, url }) => {
            const contents = url.split('/');
            const no = +contents[contents.length - 2];

            console.log(`No: ${no}, Name: ${name}`);
          });
          return data.results;
        });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
