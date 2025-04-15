
export function randomHash(len: number) {
    const characters = "dasfasfasdfs1234567890sdsaaqqwrezvmnbm3";
    const length  = characters.length;
    let ans = "";
    for(let i=0; i < len; i++) {
        ans += characters[Math.floor(Math.random()* length)];
    }
    return ans;
}