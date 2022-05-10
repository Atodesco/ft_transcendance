import { Module } from "@nestjs/common";
import { LoginModule } from "./login/login.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { ChatModule } from "./chat/chat.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
		}),
		LoginModule,
		UserModule,
		DatabaseModule,
		ChatModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
