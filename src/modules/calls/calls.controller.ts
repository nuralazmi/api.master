import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import {CurrentUser, CurrentUserData} from '@common/decorators/current-user.decorator';
import {ClientOnly} from '@common/decorators/client-only.decorator';
import {Public} from '@common/decorators/public.decorator';
import {ApiWrappedResponse} from '@common/decorators/api-wrapped-response.decorator';
import {ApiCursorPaginatedResponse} from '@common/decorators/api-cursor-paginated-response.decorator';
import {CallsService} from './calls.service';
import {CreateCallDto, CallResponseDto, ListCallsDto, TriggerTestCallDto} from './dto';

@ApiBearerAuth()
@ApiTags('Calls')
@Controller({path: 'calls', version: '1'})
@ClientOnly('calltimer')
export class CallsController {
    constructor(private readonly callsService: CallsService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiWrappedResponse(CallResponseDto, {status: 201})
    async schedule(@CurrentUser() user: CurrentUserData, @Body() dto: CreateCallDto) {
        const data = await this.callsService.schedule(user.id, dto);
        return {message: 'Call scheduled successfully', data};
    }

    @Get()
    @ApiCursorPaginatedResponse(CallResponseDto)
    async list(@CurrentUser() user: CurrentUserData, @Query() dto: ListCallsDto) {
        const result = await this.callsService.list(user.id, dto);
        return {message: 'Calls listed', ...result};
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async cancel(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
        await this.callsService.cancel(user.id, id);
        return {message: 'Call cancelled successfully'};
    }

    @Post('trigger-test')
    @HttpCode(HttpStatus.OK)
    @ApiExcludeEndpoint()
    async triggerTestCall(@Body() dto: TriggerTestCallDto) {
        const data = await this.callsService.triggerTestCall(dto.phone);
        return { message: 'Test call triggered', data };
    }

    @Public()
    @Post('webhook/twilio/status')
    @HttpCode(HttpStatus.OK)
    @ApiExcludeEndpoint()
    async handleTwilioStatus(@Body() body: Record<string, string>) {
        const { CallSid, CallStatus: status } = body;
        if (CallSid && status) {
            this.callsService.handleTwilioWebhook(CallSid, status);
        }
        return { message: 'OK' };
    }
}
