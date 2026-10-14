import fs from 'node:fs';
import { parse } from '@babel/parser';
import generateModule from '@babel/generator';
const file='src/i18n.mjs';
const ast=parse(fs.readFileSync(file,'utf8'),{sourceType:'module'});
const zh=ast.program.body[0].declarations[0].init;
const replacements={
 'A $30 deposit secures the $199 early bird price, compared with the $349 retail price. Deposit credit, refund rules and payment terms will be confirmed before paid reservations open. This website preview does not accept payments.':'预付 199 元人民币定金，即可锁定 1,399 元人民币早鸟价，常规零售价为 2,399 元人民币。定金抵扣、退订与付款细则将在正式收款前确认。当前网页仅供演示，不接受付款。',
 'Early bird price with a $30 deposit':'预付 ¥199 定金后的早鸟价',
 'Choose your preferred finish and reserve with a $30 deposit to unlock the $199 early bird price.':'选择喜欢的配色，预付 199 元人民币定金，锁定 1,399 元人民币早鸟价。',
 'With a $30 reservation deposit':'预付 199 元人民币定金后享受',
 'Prices are in USD. Deposit credit and refund terms, delivery dates, taxes and shipping charges will be confirmed before paid orders open.':'中文页面所有价格均为人民币。定金抵扣与退订细则、发货日期、税费和运费将在正式收款前确认。',
 'Retail price: $349. Early bird price: $199 with a $30 deposit. No payment processor is connected. Deposit credit and refund rules, shipping dates, warranties, local taxes and final specifications will be confirmed before a paid presale begins.':'零售价为 2,399 元人民币，预付 199 元人民币定金后享受 1,399 元人民币早鸟价。当前尚未接入支付服务。定金抵扣与退订规则、发货时间、保修、税费和最终规格将在正式收款前确认。',
};
for(const prop of zh.properties) if(Object.hasOwn(replacements,prop.key.value)) {prop.value.value=replacements[prop.key.value];delete prop.value.extra;}
fs.writeFileSync(file,generateModule.default(ast).code+'\n');
