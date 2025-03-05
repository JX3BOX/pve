import { crc32 } from "crc";
import lzf from "lzfjs";
import iconv from "iconv-lite";
import chardet from "chardet";

export const JX3DAT_SIG_FLAG = 0x4b44;

export const JX3DAT_HASH_FLAG = {
    None: 0x4e,
    Crc32: 0x43,
};

export const JX3DAT_COMPRESS_FLAG = {
    None: 0x4e,
    Lzf: 0x46,
    Lzo: 0x4c,
};

export function toJx3dat(
    content,
    { HASH_FLAG = JX3DAT_HASH_FLAG.Crc32, COMPRESS_FLAG = JX3DAT_COMPRESS_FLAG.Lzf, encoding = "gbk" } = {}
) {
    let contentBuffer = iconv.encode(content, encoding);
    // 是否需要压缩
    const originLength = contentBuffer.byteLength;
    if (COMPRESS_FLAG === JX3DAT_COMPRESS_FLAG.Lzf) {
        contentBuffer = lzf.compress(contentBuffer);
    }
    const DataLength = contentBuffer.byteLength;
    // CRC32 校验
    let crc = HASH_FLAG === JX3DAT_HASH_FLAG.Crc32 ? crc32(contentBuffer) : 0;
    const headerBuffer = Buffer.allocUnsafe(16);

    headerBuffer.writeUIntLE(HASH_FLAG, 0, 1);
    headerBuffer.writeUIntLE(COMPRESS_FLAG, 1, 1);
    headerBuffer.writeUInt16LE(JX3DAT_SIG_FLAG, 2);
    headerBuffer.writeUInt32LE(crc, 4);
    headerBuffer.writeUInt32LE(originLength, 8);
    headerBuffer.writeUInt32LE(DataLength, 12);
    const result = Buffer.concat([headerBuffer, contentBuffer]);
    return result;
}

/**
 *
 * @param {Buffer} buffer
 * @returns {{
 *      HASH_FLAG: string,
 *      COMPRESS_FLAG: string,
 *      SIG_FLAG: string,
 *      crc: string,
 *      originLength: number,
 *      dataLength: number,
 *      content: string,
 *      encoding: string
 * }}
 */
export function readJx3dat(buffer) {
    const HASH_FLAG = buffer.readUIntLE(0, 1);
    const COMPRESS_FLAG = buffer.readUIntLE(1, 1);
    const SIG_FLAG = buffer.readUInt16LE(2);

    if (SIG_FLAG !== JX3DAT_SIG_FLAG) {
        throw new Error("JX3DAT 文件标识错误");
    }
    const crc = buffer.readUInt32LE(4);
    const originLength = buffer.readUInt32LE(8);
    const dataLength = buffer.readUInt32LE(12);
    const contentBuffer = buffer.subarray(16, 16 + dataLength);
    if (HASH_FLAG === JX3DAT_HASH_FLAG.Crc32) {
        const crc2 = crc32(contentBuffer);
        if (crc !== crc2) {
            throw new Error("CRC32 校验失败");
        }
    }
    let content = COMPRESS_FLAG === JX3DAT_COMPRESS_FLAG.Lzf ? lzf.decompress(contentBuffer) : contentBuffer;
    const encoding_det = chardet.detect(content.subarray(0, 1024 * 128));
    const encoding = encoding_det.startsWith("UT") ? "utf8" : "gbk";
    content = iconv.decode(content, encoding);

    return {
        HASH_FLAG: String.fromCharCode(HASH_FLAG),
        COMPRESS_FLAG: String.fromCharCode(COMPRESS_FLAG),
        SIG_FLAG: String.fromCharCode(SIG_FLAG >> 8, SIG_FLAG & 0xff),
        crc: crc.toString(16).padStart(8, "0"),
        originLength,
        dataLength,
        content,
        encoding,
    };
}
