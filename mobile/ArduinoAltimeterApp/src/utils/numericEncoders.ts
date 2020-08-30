export type NumericEncoder = {
  encode(value: number): Uint8Array;
  decode(bytes: Uint8Array): number;
};

type TypedArrayView = {
  readonly buffer: ArrayBufferLike;
  readonly length: number;
  [index: number]: number;
};

type TypedArrayViewConstructor = {
  new (array: ArrayLike<number> | ArrayBufferLike): TypedArrayView;
  new (buffer: ArrayBufferLike, byteOffset?: number, length?: number): TypedArrayView;
};

const createCoderDecoder = (
  typedArrayViewConstructor: TypedArrayViewConstructor,
): NumericEncoder => ({
  encode(value: number): Uint8Array {
    const bytes = new typedArrayViewConstructor([value]);
    return new Uint8Array(bytes.buffer);
  },
  decode(bytes: Uint8Array): number {
    return new typedArrayViewConstructor(bytes.buffer, 0, 1)[0];
  },
});

export const Uint8Encoder = createCoderDecoder(Uint8Array);
export const Int8Encoder = createCoderDecoder(Int8Array);
export const Uint16Encoder = createCoderDecoder(Uint16Array);
export const Int16Encoder = createCoderDecoder(Int16Array);
export const Uint32Encoder = createCoderDecoder(Uint32Array);
export const Int32Encoder = createCoderDecoder(Int32Array);
