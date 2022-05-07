import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => ({
				type: process.env.DATABASE_TYPE as "aurora-mysql",
				host: process.env.DATABASE_HOST,
				port: Number(process.env.DATABASE_PORT),
				username: process.env.DATABASE_USERNAME,
				password: process.env.DATABASE_PASSWORD,
				database: process.env.DATABASE_NAME,
				entities: [User],
				synchronize: true, //false for production, else destroy/recreate data in the db
			}),
		}),
	],
})
export class DatabaseModule {}
