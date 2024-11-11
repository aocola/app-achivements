import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule,
    MongooseModule.forRoot(
      `mongodb+srv://alvaroocola:4uiqvImCR0c5klZC@cluster0.tsp3o.mongodb.net/?retryWrites=true&w=majority&appName=sample`
      ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
