import { Injectable } from "@nestjs/common";


@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>
    ) {}
}