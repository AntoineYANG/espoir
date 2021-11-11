/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 20:57:23 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 20:49:24
 */

import chalk from 'chalk';
import readline from 'readline';
import type { PropertySchema } from './require-input';
import styles from './styles';


const printResult = (info: string, spaces: number) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.moveCursor(0, -1);
  console.log(`${chalk`{${styles.pink} │}`} ${info}${' '.repeat(spaces - info.length + 1)}`);
  readline.cursorTo(process.stdout, 0);
};

export const requireStringInput = (
  name: string, defaultValue: string, schema: PropertySchema, rl: readline.Interface
) => new Promise<string | undefined>(resolve => {
  const text = (info?: string) => `${chalk`{${styles.pink} │} {${styles.cyan}.bold ${`> ${name}`}}` + (
    schema.required ? '' : chalk` {${styles.gray} <optional>}`
  ) + (
    schema.desc ? chalk` {${styles.blue} ${`/** ${schema.desc} */`}}` : ''
  ) + chalk`{${styles.cyan} ${': '}}` + (
    info ? chalk`{${styles.red} ${`${info} `}}` : ''
  ) + chalk`{${styles.gray}.underline ${defaultValue.trim()}}`} `;
  
  const question = (info?: string) => {
    rl.question(
      text(info),
      ans => {
        if (ans.length === 0) {
          if (schema.defaultValue !== undefined) {
            const t = chalk`  {${styles.blueBright} ${name}: }${
              schema.defaultValue
            }`;
            printResult(t, text(info).length);
            resolve(schema.defaultValue);
            return;
          }
          if (schema.required) {
            const tips = schema.tips?.(ans) ?? `"${name}" is required`;
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            process.stdout.moveCursor(0, -1);
            question(tips);
          } else {
            const t = chalk`  {${styles.blue} ${name}:} {${styles.gray} undefined}`;
            printResult(t, text(info).length);
            resolve(undefined);
          }
          return;
        }
        if (schema.pattern?.test(ans) === false || schema.checker?.(ans) === false) {
          const tips = schema.tips?.(ans) ?? `"${ans}" is not an valid value`;
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0);
          process.stdout.moveCursor(0, -1);
          question(tips);
          return;
        } 
        const t = chalk`  {${styles.blueBright} ${name}:} {${styles.white} ${ans}}`;
        printResult(t, text(info).length);
        resolve(ans);
        return;
        
      }
    );
  };
  question();
});

export const requireBooleanInput = (
  name: string, defaultValue: boolean, schema: PropertySchema, rl: readline.Interface
) => new Promise<boolean>(resolve => {
  const text = (checked: boolean) => {
    const raw = `${chalk`{${styles.pink} │} {${styles.cyan}.bold >}` + (
      // checked ? chalk.green`🗹` : chalk.white`☐`
      checked ? chalk` {${styles.greenBright} ✓}` : chalk` {${styles.red} x}`
    )} ${chalk`{${styles.cyan}.bold ${name}}`  
    }${schema.desc ? chalk` {${styles.blue} ${`/** ${schema.desc} */`}}` : ''}`;
    return raw + chalk`{${styles.pink}   [i] Press {bold.underline space} or {bold.underline arrows} to switch and press {bold.underline enter} to confirm}`;
  };
  
  console.info(text(defaultValue));

  let value = defaultValue;
  let debounceLock = false;

  const listener = (_: any, key: any) => {
    if (key?.ctrl && key.name == 'c') {
      process.stdin.pause();
      return;
    }
    if (debounceLock) {
      return;
    } 
    debounceLock = true;
    setTimeout(() => {
      debounceLock = false;
    }, 120);
    
    if (/(space|up|down|left|right)/.test(key.name)) {
      value = !value;
    } else if (/(return)/.test(key.name)) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -1);
      resolve(value);
      process.stdin.removeListener('keypress', listener);
      const info = chalk`  {${styles.blueBright} ${
        `${name}: `
      }}{${styles.cyan} ${
        JSON.stringify(value)
      }}`;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -1);
      printResult(info, text(!value).length);
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -2);
      return;
    }
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.moveCursor(0, -1);
    console.info(text(value));
  };
  
  process.stdin.on('keypress', listener);
});

export const requireOptionInput = (
  name: string, options: string[], schema: PropertySchema
) => new Promise<string>(resolve => {
  let cursor = 0;

  const text = () => {
    const question = chalk`{${styles.pink} │} {${styles.cyan}.bold * }` + chalk`{${styles.cyan}.bold ${name}}` + (
      schema.desc ? chalk` {${styles.blue} ${`/** ${schema.desc} */`}}` : ''
    );
    const help = chalk`{${styles.pink}   [i] Use {bold.underline arrows} to switch and press {bold.underline enter} to confirm}`;
    
    const contents = options.map((k, i) => {
      const active = i === cursor;
      return (
        chalk`{${styles.pink} │}  {${styles.cyan}.bold ${active ? '✓ ' : '  '}}` + (
          chalk`{${styles.blueBright}${active ? '.underline.bold' : ''} ${k}}`
        )
      );
    });
    return `${question + help}\n${contents.join('\n')}`;
  };
  
  console.info(text());

  let debounceLock = false;

  const listener = (_: any, key: any) => {
    if (key?.ctrl && key.name == 'c') {
      process.stdin.pause();
      return;
    }
    if (debounceLock) {
      return;
    } 
    debounceLock = true;
    setTimeout(() => {
      debounceLock = false;
    }, 120);
    
    if (/(up|left)/.test(key.name)) {
      cursor = (cursor + options.length - 1) % options.length;
    } else if (/(down|right)/.test(key.name)) {
      cursor = (cursor + 1) % options.length;
    } else if (/(return)/.test(key.name)) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -2);
      resolve(options[cursor]);
      process.stdin.removeListener('keypress', listener);
      console.log(chalk`{${styles.pink} │}`);
      return;
    }
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.moveCursor(0, -1 * options.length - 1);
    console.info(text());
  };
  
  process.stdin.on('keypress', listener);
});

export const requireCheckBoxInput = (
  name: string, options: [string, boolean, string?][], schema: PropertySchema
) => new Promise<Record<string, boolean>>(resolve => {
  const data = options.map(opt => [opt[0], opt[1], opt[2] ?? opt[0]]) as typeof options;
  let cursor = 0;

  const text = () => {
    const question = chalk`{${styles.pink} │} {${styles.cyan}.bold + }` + chalk`{${styles.cyan}.bold ${name}}` + (
      schema.desc ? chalk` {${styles.blue} ${`/** ${schema.desc} */`}}` : ''
    );
    const help = chalk`{${styles.pink}   [i] Press {bold.underline space} to select, use {bold.underline arrows} to move and press {bold.underline enter} to confirm}`;
    const contents = data.map(([_, checked, k], i) => {
      const active = i === cursor;
      return (
        chalk`{${styles.pink} │} ` + (
          active ? chalk`{${styles.cyan}.bold ${active ? '>' : ' '} }` : '  '
        ) + (
          checked ? (
            active ? chalk`{${styles.greenBright}.underline ✓ }` : chalk`{${styles.greenBright} ✓ }`
          ) : chalk`{${styles.red}${active ? '.underline' : ''} x }`
        ) + (
          chalk`{${styles.blueBright}${active ? '.underline.bold' : ''} ${k} }`
        )
      );
    });
    return `${question + help}\n${contents.join('\n')}`;
  };
  
  console.info(text());

  let debounceLock = false;

  const listener = (_: any, key: any) => {
    if (key?.ctrl && key.name == 'c') {
      process.stdin.pause();
      return;
    }
    if (debounceLock) {
      return;
    } 
    debounceLock = true;
    setTimeout(() => {
      debounceLock = false;
    }, 120);
    
    if (/(space)/.test(key.name)) {
      data[cursor][1] = !data[cursor][1];
    } else if (/(up|left)/.test(key.name)) {
      cursor = (cursor + data.length - 1) % data.length;
    } else if (/(down|right)/.test(key.name)) {
      cursor = (cursor + 1) % data.length;
    } else if (/(return)/.test(key.name)) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -2);
      console.log(chalk`{${styles.pink} │}`);
      const result: Record<string, boolean> = {};
      data.forEach(([k, v]) => {
        result[k] = v;
      });
      resolve(result);
      process.stdin.removeListener('keypress', listener);
      return;
    }
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.moveCursor(0, -1 * data.length - 1);
    console.info(text());
  };
  
  process.stdin.on('keypress', listener);
});