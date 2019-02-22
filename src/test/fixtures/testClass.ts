export class TestClass {
    sleep(ms: number): Promise<number> {
        console.log(`Waiting for ${ms} ms...`);
        return new Promise<number>(resolve => {
            setTimeout(() => resolve(1), ms);
        });
    }

    static hello(name: string): string {
        return `Hello ${name}!`;
    }
}
