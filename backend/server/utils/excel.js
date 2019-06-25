var xlsx = require('js-xlsx');
var headerChecking = require('./headerChecking').check;

function excelExports(sheetName, _headers, _data, path) {
    // _headers 原始格式
    // [ { name: 'id', type: String },
    //   { name: 'name', type: String },
    //   { name: 'age', type: String },
    //   { name: 'country', type: String },
    //   { name: 'remark', type: String } ]
    var headers = _headers
        // 为 _headers 添加对应的单元格位置
        // [ { v: 'id', position: 'A1' },
        //   { v: 'name', position: 'B1' },
        //   { v: 'age', position: 'C1' },
        //   { v: 'country', position: 'D1' },
        //   { v: 'remark', position: 'E1' } ]
        .map((v, i) => Object.assign({}, { v: v.name, position: String.fromCharCode(65 + i) + 1 }))
        // 转换成 worksheet 需要的结构
        // { A1: { v: 'id' },
        //   B1: { v: 'name' },
        //   C1: { v: 'age' },
        //   D1: { v: 'country' },
        //   E1: { v: 'remark' } }
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

    // console.log('_data: ', _data);
    // console.log('_headers: ', _headers);

    // console.log("_data: ", data);

    var data = _data
        // 匹配 headers 的位置，生成对应的单元格数据
        // [ [ { v: '1', position: 'A2' },
        //     { v: 'test1', position: 'B2' },
        //     { v: '30', position: 'C2' },
        //     { v: 'China', position: 'D2' },
        //     { v: 'hello', position: 'E2' } ],
        //   [ { v: '2', position: 'A3' },
        //     { v: 'test2', position: 'B3' },
        //     { v: '20', position: 'C3' },
        //     { v: 'America', position: 'D3' },
        //     { v: 'world', position: 'E3' } ],
        //   [ { v: '3', position: 'A4' },
        //     { v: 'test3', position: 'B4' },
        //     { v: '18', position: 'C4' },
        //     { v: 'Unkonw', position: 'D4' },
        //     { v: '???', position: 'E4' } ] ]
        .map((v, i) => _headers.map((k, j) => {
            let newV = v[k.name];
            // console.log('k.type: ', k.type === 'Date');
            if (v[k.name] == null)
                newV = '';
            else if (k.type === 'Date')
                newV = new Date(v[k.name]).toLocaleString();
            return Object.assign({}, { v: newV, position: String.fromCharCode(65 + j) + (i + 2) });
        }))
        // 对刚才的结果进行降维处理（二维数组变成一维数组）
        // [ { v: '1', position: 'A2' },
        //   { v: 'test1', position: 'B2' },
        //   { v: '30', position: 'C2' },
        //   { v: 'China', position: 'D2' },
        //   { v: 'hello', position: 'E2' },
        //   { v: '2', position: 'A3' },
        //   { v: 'test2', position: 'B3' },
        //   { v: '20', position: 'C3' },
        //   { v: 'America', position: 'D3' },
        //   { v: 'world', position: 'E3' },
        //   { v: '3', position: 'A4' },
        //   { v: 'test3', position: 'B4' },
        //   { v: '18', position: 'C4' },
        //   { v: 'Unkonw', position: 'D4' },
        //   { v: '???', position: 'E4' } ]
        .reduce((prev, next) => prev.concat(next))
        // 转换成 worksheet 需要的结构
        //   { A2: { v: '1' },
        //     B2: { v: 'test1' },
        //     C2: { v: '30' },
        //     D2: { v: 'China' },
        //     E2: { v: 'hello' },
        //     A3: { v: '2' },
        //     B3: { v: 'test2' },
        //     C3: { v: '20' },
        //     D3: { v: 'America' },
        //     E3: { v: 'world' },
        //     A4: { v: '3' },
        //     B4: { v: 'test3' },
        //     C4: { v: '18' },
        //     D4: { v: 'Unkonw' },
        //     E4: { v: '???' } }
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

    // 合并 headers 和 data
    var output = Object.assign({}, headers, data);
    // 获取所有单元格的位置
    var outputPos = Object.keys(output);
    // 计算出范围
    var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];


    // console.log('_data: ', _data);
    // console.log('headers: ', headers);
    // console.log('data: ', data);
    // 构建 workbook 对象
    var wb = {
        SheetNames: [sheetName],
        Sheets: {
            [sheetName]: Object.assign({}, output, { '!ref': ref })
        }
    };

    xlsx.writeFile(wb, path);
    return { code: 0 };
}

function excelImports(fileName, _headers) {
    const workbook = xlsx.readFile(fileName)
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
    // console.log(worksheet);

    const checkHeaders = [];
    const headers = {};
    const data = [];
    const keys = Object.keys(worksheet);
    keys
        // 过滤以 ! 开头的 key
        .filter(k => k[0] !== '!')
        // 遍历所有单元格
        .forEach(k => {
            // 如 A11 中的 A
            let col = k.substring(0, 1);
            // 如 A11 中的 11
            let row = parseInt(k.substring(1));
            // 当前单元格的值
            let value = worksheet[k].v;

            // 保存字段名
            if (row === 1) {
                headers[col] = value;
                checkHeaders.push(value);
                return;
            }

            // 解析成 JSON
            if (!data[row]) {
                data[row] = {};
            }

            if (value)
                data[row][headers[col]] = value;
        });

    // console.log(data); // [ { '姓名': 'test1', '年龄': 20 }, { '姓名': 'test2', '年龄': 10 } ... ]

    return headerChecking(_headers, checkHeaders)
        ? { code: 0, data }
        : { code: 1, msg: '文件格式不正确' };
    // 测试程序
    // User.deleteMany({}, function(err, doc) {

    // })
    // User.insertMany(data, function(err, doc) {
    //     console.log(err);
    //     console.log(doc);
    // });
}

module.exports = {
    excelExports,
    excelImports
};
