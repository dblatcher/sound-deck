import { TEST_CONST } from "../src/index";
import { expect, it } from 'vitest';



it('is 42', () => {
    expect(TEST_CONST).toEqual(42)
})