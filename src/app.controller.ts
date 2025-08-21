import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    /**
     * @description getHello
     * @returns {string}
     */
    @Get()
    getHello() {
        return this.appService.getHello();
    }

    /**
     * @description update
     * @returns {string}
     */
    update() {
        return 'update';
    }

    /**
     * @description delete
     * @returns {string}
     */
    delete() {
        return 'delete';
    }
}
