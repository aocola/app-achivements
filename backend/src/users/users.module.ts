import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserController } from './infrastructure/controller/create-user.controller';
import { LoginUserController } from './infrastructure/controller/login-user.controller';
import { RegisterCustomerController } from './infrastructure/controller/register-customer.controller';
import { CreateUserService } from './applicatiton/use-case/create-user.service';
import { LoginUserService } from './applicatiton/use-case/login-user.service';
import { RegisterCustomerService } from './applicatiton/use-case/register-customers.service';
import { MongoUserRepository } from './infrastructure/repository/mongo-db/MongoUserRepository';
import { MongoMedalRepository } from './infrastructure/repository/mongo-db/MongoMedalRepository';
import { MongoDetailRepository } from './infrastructure/repository/mongo-db/MongoDetailRepository';
import { MongoCustomerRepository } from './infrastructure/repository/mongo-db/MongoCustomerRepository';
import { UserRepository } from './domain/repository/user.repository';
import { MedalRepository } from './domain/repository/medal.repository';
import { CustomerRepository } from './domain/repository/customers.repository';
import { DetailRepository } from './domain/repository/detail.repository';
import { UserSchema } from './infrastructure/repository/mongo-db/schema/user.schema';
import { User } from './domain/entities/user.entity';
import { Medalla } from './domain/entities/medal.entity';
import { MedallaSchema } from './infrastructure/repository/mongo-db/schema/medal.schema';
import { Cliente } from './domain/entities/client.entity';
import { ClienteSchema } from './infrastructure/repository/mongo-db/schema/client.schema';
import { DetalleSchema } from './infrastructure/repository/mongo-db/schema/detail.schema';
import { Detalle } from './domain/entities/detail.entity';
import { AcceptDetailController } from './infrastructure/controller/accept-detail.controller';
import { RejectDetailController } from './infrastructure/controller/reject-detail.controller';
import { GetUserDetailController } from './infrastructure/controller/get-user-detail.controller';
import { RetryDetailController } from './infrastructure/controller/retry-detail.controller';
import { GetAllDetailController } from './infrastructure/controller/get-user-all-detail.controller';
import { GetMedalByUserController } from './infrastructure/controller/get-medal-user.controller';
import { GetMedalsByUserService } from './applicatiton/use-case/get-medals-user.service';
import { GetUserDetailService } from './applicatiton/use-case/get-details-user.service';
import { GetAllDetailService } from './applicatiton/use-case/get-all-details.service';
import { AcceptDetailService } from './applicatiton/use-case/accept-detail.service';
import { RejectDetailService } from './applicatiton/use-case/reject-detail.service';
import { RetryDetailService } from './applicatiton/use-case/retry-detail.service';
import { NotificationGateway } from './infrastructure/gateway/details.gateway.websocket';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Medalla.name, schema: MedallaSchema }, // Registro del esquema Medalla
      { name: Cliente.name, schema: ClienteSchema }, // Registro del esquema Medalla
      { name: Detalle.name, schema: DetalleSchema }, // Registro del esquema Medalla
    ]),
  ],
  controllers: [
    CreateUserController,
    LoginUserController,
    RegisterCustomerController,
    AcceptDetailController,
    RejectDetailController,
    RetryDetailController,
    GetUserDetailController,
    GetAllDetailController,
    GetMedalByUserController
  ],
  providers: [
    CreateUserService,
    LoginUserService,
    RegisterCustomerService,
    GetMedalsByUserService,
    GetUserDetailService,
    GetAllDetailService,
    AcceptDetailService,
    RejectDetailService,
    RetryDetailService,
    MongoUserRepository,
    MongoMedalRepository,
    MongoDetailRepository,
    MongoCustomerRepository,
    NotificationGateway,
    {
      provide: UserRepository,
      useClass: MongoUserRepository,
    },
    {
      provide: MedalRepository,
      useClass: MongoMedalRepository,
    },
    {
      provide: CustomerRepository,
      useClass: MongoCustomerRepository,
    },
    {
      provide: DetailRepository,
      useClass: MongoDetailRepository,
    },
  ],
  exports: [
    UserRepository,
    MedalRepository,
    CustomerRepository,
    DetailRepository,
    NotificationGateway
  ],
})
export class UsersModule {}
