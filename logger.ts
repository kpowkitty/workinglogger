namespace logger {
    //% block
    export function none(): null {
        return null
    }

    //% block
    export function sendBuffer(buffer: Buffer) {
        radio.sendBuffer(buffer);
    }

    //% block
    export function concatenateBuffers(buf1: Buffer, buf2: Buffer): Buffer {
        return Buffer.concat([buf1, buf2]);
    }

    //% block
    export function compareBuffers(buf1: Buffer, buf2: Buffer): boolean {
        if (buf1.length != buf2.length) {
            return false;
        }

        for (let i = 0; i < buf1.length; i++) {
            if (buf1.getUint8(i) != buf2.getUint8(i)) {
                return false;
            }
        }
        return true;
    }

    //% block
    export function bufferToString(buff: Buffer): string {
        let str = buff.toString();
        return str
    }

    /*
        The data can be received in any order, therefore, this function
        parses which data was received and informs the program.
    */
    //% block
    export function parseIncomingData(data: Buffer): number {
        const KEY_SIZE = 5;

        const ktemp = "temp ";
        const klight = "light";
        let dataAsString = logger.bufferToString(data)

        if (dataAsString.slice(0, KEY_SIZE) == ktemp) {
            return 0;
        } else if (dataAsString.slice(0, KEY_SIZE) == klight) {
            return 1;
        } else {
            //basic.showString("Assertion failed:");
            //basic.showString("dtemp[:KEY_SIZE]:" + dataAsString.slice(0, KEY_SIZE));
            return -1;
        }
    }

    //% block
    export function storeLight(light: Buffer): string {
        const KEY_SIZE = 5;
        let dlight = logger.bufferToString(light);
        dlight = dlight.slice(KEY_SIZE);
        return dlight;
    }

    //% block
    export function storeTemp(temp: Buffer): string {
        const KEY_SIZE = 5;
        let dtemp = logger.bufferToString(temp);
        dtemp = dtemp.slice(KEY_SIZE);
        return dtemp;
    }

    //% block
    /*export function storeData(temp: string, light: string): { Temperature: number; Light: number } {
        const data: { Temperature: number; Light: number } = {
            Temperature: 0,
            Light: 0
        };
        const KEY_SIZE = 5;

        const ktemp = "temp ";
        const klight = "light";

        // XXX Returns empty / partially filled data if error
        if (temp.slice(0, KEY_SIZE) !== ktemp) {
            basic.showString("Assertion failed:");
            basic.showString("dtemp[:KEY_SIZE]:" + temp.slice(0, KEY_SIZE));
            return data;
        }
        data.Temperature = parseInt(temp.slice(KEY_SIZE));

        if (light.slice(0, KEY_SIZE) !== klight) {
            basic.showString("Assertion failed:");
            basic.showString("dlight[:KEY_SIZE]:" + light.slice(0, KEY_SIZE));
            return data;
        }
        data.Light = parseInt(light.slice(KEY_SIZE));

        return data;
    }*/

    //% block
    export function stringToBuffer(str: string): Buffer {
        return Buffer.fromUTF8(str);
    }
}
