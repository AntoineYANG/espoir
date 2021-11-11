(() => {
  const t = { 449: (t, e, i) => {
    'use strict'; console.log('hello world'), process.on('unhandledRejection', (t => {
      throw t; 
    })); const s = i(465); s.program.version('0.0.0-alpha-1.3.0'), s.program.command('project [dir]').description('create a new project').aliases(['p']).action(((t, e) => {})), s.program.parse(process.argv); 
  }, 81:  t => {
    'use strict'; t.exports = require('child_process'); 
  }, 361: t => {
    'use strict'; t.exports = require('events'); 
  }, 147: t => {
    'use strict'; t.exports = require('fs'); 
  }, 17:  t => {
    'use strict'; t.exports = require('path'); 
  }, 465: (t, e, i) => {
    const { Argument:s } = i(341); const { Command:n } = i(943); const { CommanderError:r, InvalidArgumentError:o } = i(481); const { Help:a } = i(120); const { Option:h } = i(190); (e = t.exports = new n()).program = e, e.Argument = s, e.Command = n, e.CommanderError = r, e.Help = a, e.InvalidArgumentError = o, e.InvalidOptionArgumentError = o, e.Option = h; 
  }, 341: (t, e, i) => {
    const { InvalidArgumentError:s } = i(481);

    e.Argument = class {
      constructor(t, e) {
        switch (this.description = e || '', this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription = void 0, this.argChoices = void 0, t[0]) {
          case '<': this.required = !0, this._name = t.slice(1, -1); break; case '[': this.required = !1, this._name = t.slice(1, -1); break; default: this.required = !0, this._name = t; 
        } this._name.length > 3 && '...' === this._name.slice(-3) && (this.variadic = !0, this._name = this._name.slice(0, -3)); 
      }

      name() {
        return this._name; 
      }

      _concatValue(t, e) {
        return e !== this.defaultValue && Array.isArray(e) ? e.concat(t) : [t]; 
      }

      default(t, e) {
        return this.defaultValue = t, this.defaultValueDescription = e, this; 
      }

      argParser(t) {
        return this.parseArg = t, this; 
      }

      choices(t) {
        return this.argChoices = t, this.parseArg = (e, i) => {
          if (!t.includes(e)) {
            throw new s(`Allowed choices are ${t.join(', ')}.`); 
          } return this.variadic ? this._concatValue(e, i) : e; 
        }, this; 
      }

      argRequired() {
        return this.required = !0, this; 
      }

      argOptional() {
        return this.required = !1, this; 
      }
    }, e.humanReadableArgName = function (t) {
      const e = t.name() + (!0 === t.variadic ? '...' : ''); return t.required ? `<${e}>` : `[${e}]`; 
    }; 
  }, 943: (t, e, i) => {
    const s = i(361).EventEmitter; const n = i(81); const r = i(17); const o = i(147); const { Argument:a, humanReadableArgName:h } = i(341); const { CommanderError:l } = i(481); const { Help:p } = i(120); const { Option:c, splitOptionFlags:u } = i(190); const { suggestSimilar:m } = i(531);

    class d extends s {
      constructor(t) {
        super(), this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this._args = [], this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = t || '', this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = '', this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !1, this._outputConfiguration = { writeOut: t => process.stdout.write(t), writeErr: t => process.stderr.write(t), getOutHelpWidth: () => (process.stdout.isTTY ? process.stdout.columns : void 0), getErrHelpWidth: () => (process.stderr.isTTY ? process.stderr.columns : void 0), outputError: (t, e) => e(t) }, this._hidden = !1, this._hasHelpOption = !0, this._helpFlags = '-h, --help', this._helpDescription = 'display help for command', this._helpShortFlag = '-h', this._helpLongFlag = '--help', this._addImplicitHelpCommand = void 0, this._helpCommandName = 'help', this._helpCommandnameAndArgs = 'help [command]', this._helpCommandDescription = 'display help for command', this._helpConfiguration = {}; 
      }

      copyInheritedSettings(t) {
        return this._outputConfiguration = t._outputConfiguration, this._hasHelpOption = t._hasHelpOption, this._helpFlags = t._helpFlags, this._helpDescription = t._helpDescription, this._helpShortFlag = t._helpShortFlag, this._helpLongFlag = t._helpLongFlag, this._helpCommandName = t._helpCommandName, this._helpCommandnameAndArgs = t._helpCommandnameAndArgs, this._helpCommandDescription = t._helpCommandDescription, this._helpConfiguration = t._helpConfiguration, this._exitCallback = t._exitCallback, this._storeOptionsAsProperties = t._storeOptionsAsProperties, this._combineFlagAndOptionalValue = t._combineFlagAndOptionalValue, this._allowExcessArguments = t._allowExcessArguments, this._enablePositionalOptions = t._enablePositionalOptions, this._showHelpAfterError = t._showHelpAfterError, this._showSuggestionAfterError = t._showSuggestionAfterError, this; 
      }

      command(t, e, i) {
        let s = e; let n = i; 'object' === typeof s && null !== s && (n = s, s = null), n = n || {}; const [, r, o] = t.match(/([^ ]+) *(.*)/); const a = this.createCommand(r); return s && (a.description(s), a._executableHandler = !0), n.isDefault && (this._defaultCommandName = a._name), a._hidden = !(!n.noHelp && !n.hidden), a._executableFile = n.executableFile || null, o && a.arguments(o), this.commands.push(a), a.parent = this, a.copyInheritedSettings(this), s ? this : a; 
      }

      createCommand(t) {
        return new d(t); 
      }

      createHelp() {
        return Object.assign(new p(), this.configureHelp()); 
      }

      configureHelp(t) {
        return void 0 === t ? this._helpConfiguration : (this._helpConfiguration = t, this); 
      }

      configureOutput(t) {
        return void 0 === t ? this._outputConfiguration : (Object.assign(this._outputConfiguration, t), this); 
      }

      showHelpAfterError(t = !0) {
        return 'string' !== typeof t && (t = Boolean(t)), this._showHelpAfterError = t, this; 
      }

      showSuggestionAfterError(t = !0) {
        return this._showSuggestionAfterError = Boolean(t), this; 
      }

      addCommand(t, e) {
        if (!t._name) {
          throw new Error('Command passed to .addCommand() must have a name'); 
        } return (function t(e) {
          e.forEach((e => {
            if (e._executableHandler && !e._executableFile) {
              throw new Error(`Must specify executableFile for deeply nested executable: ${e.name()}`); 
            } t(e.commands); 
          })); 
        }(t.commands)), (e = e || {}).isDefault && (this._defaultCommandName = t._name), (e.noHelp || e.hidden) && (t._hidden = !0), this.commands.push(t), t.parent = this, this; 
      }

      createArgument(t, e) {
        return new a(t, e); 
      }

      argument(t, e, i, s) {
        const n = this.createArgument(t, e); return 'function' === typeof i ? n.default(s).argParser(i) : n.default(i), this.addArgument(n), this; 
      }

      arguments(t) {
        return t.split(/ +/).forEach((t => {
          this.argument(t); 
        })), this; 
      }

      addArgument(t) {
        const e = this._args.slice(-1)[0];

        if (e && e.variadic) {
          throw new Error(`only the last argument can be variadic '${e.name()}'`); 
        } if (t.required && void 0 !== t.defaultValue && void 0 === t.parseArg) {
          throw new Error(`a default value for a required argument is never used: '${t.name()}'`); 
        } return this._args.push(t), this; 
      }

      addHelpCommand(t, e) {
        return !1 === t ? this._addImplicitHelpCommand = !1 : (this._addImplicitHelpCommand = !0, 'string' === typeof t && (this._helpCommandName = t.split(' ')[0], this._helpCommandnameAndArgs = t), this._helpCommandDescription = e || this._helpCommandDescription), this; 
      }

      _hasImplicitHelpCommand() {
        return void 0 === this._addImplicitHelpCommand ? this.commands.length && !this._actionHandler && !this._findCommand('help') : this._addImplicitHelpCommand; 
      }

      hook(t, e) {
        const i = ['preAction', 'postAction'];

        if (!i.includes(t)) {
          throw new Error(`Unexpected value for event passed to hook : '${t}'.\nExpecting one of '${i.join("', '")}'`); 
        } return this._lifeCycleHooks[t] ? this._lifeCycleHooks[t].push(e) : this._lifeCycleHooks[t] = [e], this; 
      }

      exitOverride(t) {
        return this._exitCallback = t || (t => {
          if ('commander.executeSubCommandAsync' !== t.code) {
            throw t; 
          } 
        }), this; 
      }

      _exit(t, e, i) {
        this._exitCallback && this._exitCallback(new l(t, e, i)), process.exit(t); 
      }

      action(t) {
        return this._actionHandler = e => {
          const i = this._args.length; const s = e.slice(0, i); return this._storeOptionsAsProperties ? s[i] = this : s[i] = this.opts(), s.push(this), t.apply(this, s); 
        }, this; 
      }

      createOption(t, e) {
        return new c(t, e); 
      }

      addOption(t) {
        const e = t.name(); const i = t.attributeName(); let s = t.defaultValue;

        if (t.negate || t.optional || t.required || 'boolean' === typeof s) {
          if (t.negate) {
            const e = t.long.replace(/^--no-/, '--'); s = !this._findOption(e) || this.getOptionValue(i); 
          } void 0 !== s && this.setOptionValueWithSource(i, s, 'default'); 
        } this.options.push(t);

        const n = (e, n, r) => {
          const o = this.getOptionValue(i);

          if (null !== e && t.parseArg) {
            try {
              e = t.parseArg(e, void 0 === o ? s : o); 
            } catch (t) {
              if ('commander.invalidArgument' === t.code) {
                const e = `${n} ${t.message}`; this._displayError(t.exitCode, t.code, e); 
              } throw t; 
            } 
          } else {
            null !== e && t.variadic && (e = t._concatValue(e, o)); 
          }'boolean' === typeof o || void 0 === o ? null == e ? this.setOptionValueWithSource(i, !t.negate && (s || !0), r) : this.setOptionValueWithSource(i, e, r) : null !== e && this.setOptionValueWithSource(i, !t.negate && e, r); 
        }; return this.on(`option:${e}`, (e => {
          const i = `error: option '${t.flags}' argument '${e}' is invalid.`; n(e, i, 'cli'); 
        })), t.envVar && this.on(`optionEnv:${e}`, (e => {
          const i = `error: option '${t.flags}' value '${e}' from env '${t.envVar}' is invalid.`; n(e, i, 'env'); 
        })), this; 
      }

      _optionEx(t, e, i, s, n) {
        const r = this.createOption(e, i);

        if (r.makeOptionMandatory(Boolean(t.mandatory)), 'function' === typeof s) {
          r.default(n).argParser(s); 
        } else if (s instanceof RegExp) {
          const t = s; s = (e, i) => {
            const s = t.exec(e); return s ? s[0] : i; 
          }, r.default(n).argParser(s); 
        } else {
          r.default(s); 
        } return this.addOption(r); 
      }

      option(t, e, i, s) {
        return this._optionEx({}, t, e, i, s); 
      }

      requiredOption(t, e, i, s) {
        return this._optionEx({ mandatory: !0 }, t, e, i, s); 
      }

      combineFlagAndOptionalValue(t = !0) {
        return this._combineFlagAndOptionalValue = Boolean(t), this; 
      }

      allowUnknownOption(t = !0) {
        return this._allowUnknownOption = Boolean(t), this; 
      }

      allowExcessArguments(t = !0) {
        return this._allowExcessArguments = Boolean(t), this; 
      }

      enablePositionalOptions(t = !0) {
        return this._enablePositionalOptions = Boolean(t), this; 
      }

      passThroughOptions(t = !0) {
        if (this._passThroughOptions = Boolean(t), this.parent && t && !this.parent._enablePositionalOptions) {
          throw new Error('passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)'); 
        } return this; 
      }

      storeOptionsAsProperties(t = !0) {
        if (this._storeOptionsAsProperties = Boolean(t), this.options.length) {
          throw new Error('call .storeOptionsAsProperties() before adding options'); 
        } return this; 
      }

      getOptionValue(t) {
        return this._storeOptionsAsProperties ? this[t] : this._optionValues[t]; 
      }

      setOptionValue(t, e) {
        return this._storeOptionsAsProperties ? this[t] = e : this._optionValues[t] = e, this; 
      }

      setOptionValueWithSource(t, e, i) {
        return this.setOptionValue(t, e), this._optionValueSources[t] = i, this; 
      }

      getOptionValueSource(t) {
        return this._optionValueSources[t]; 
      }

      _prepareUserArgs(t, e) {
        if (void 0 !== t && !Array.isArray(t)) {
          throw new Error('first parameter to parse must be array or undefined'); 
        } let s;

        switch (e = e || {}, void 0 === t && (t = process.argv, process.versions && process.versions.electron && (e.from = 'electron')), this.rawArgs = t.slice(), e.from) {
          case void 0: case 'node': this._scriptPath = t[1], s = t.slice(2); break; case 'electron': process.defaultApp ? (this._scriptPath = t[1], s = t.slice(2)) : s = t.slice(1); break; case 'user': s = t.slice(0); break; default: throw new Error(`unexpected parse option { from: '${e.from}' }`); 
        } return !this._scriptPath && i.c[i.s] && (this._scriptPath = i.c[i.s].filename), this._name = this._name || this._scriptPath && r.basename(this._scriptPath, r.extname(this._scriptPath)), s; 
      }

      parse(t, e) {
        const i = this._prepareUserArgs(t, e); return this._parseCommand([], i), this; 
      }

      async parseAsync(t, e) {
        const i = this._prepareUserArgs(t, e); return await this._parseCommand([], i), this; 
      }

      _executeSubCommand(t, e) {
        e = e.slice(); let s = !1; const a = [
          '.js',
          '.ts',
          '.tsx',
          '.mjs',
          '.cjs'
        ]; this._checkForMissingMandatoryOptions(); let h; let p = this._scriptPath; !p && i.c[i.s] && (p = i.c[i.s].filename);

        try {
          const t = o.realpathSync(p); h = r.dirname(t); 
        } catch (t) {
          h = '.'; 
        } let c = `${r.basename(p, r.extname(p))}-${t._name}`; t._executableFile && (c = t._executableFile); const u = r.join(h, c); let m; o.existsSync(u) ? c = u : a.forEach((t => {
          o.existsSync(`${u}${t}`) && (c = `${u}${t}`); 
        })), s = a.includes(r.extname(c)), 'win32' !== process.platform ? s ? (e.unshift(c), e = _(process.execArgv).concat(e), m = n.spawn(process.argv[0], e, { stdio: 'inherit' })) : m = n.spawn(c, e, { stdio: 'inherit' }) : (e.unshift(c), e = _(process.execArgv).concat(e), m = n.spawn(process.execPath, e, { stdio: 'inherit' })), [
          'SIGUSR1',
          'SIGUSR2',
          'SIGTERM',
          'SIGINT',
          'SIGHUP'
        ].forEach((t => {
          process.on(t, (() => {
            !1 === m.killed && null === m.exitCode && m.kill(t); 
          })); 
        })); const d = this._exitCallback; d ? m.on('close', (() => {
          d(new l(process.exitCode || 0, 'commander.executeSubCommandAsync', '(close)')); 
        })) : m.on('close', process.exit.bind(process)), m.on('error', (e => {
          if ('ENOENT' === e.code) {
            const e = `'${c}' does not exist\n - if '${t._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead\n - if the default executable name is not suitable, use the executableFile option to supply a custom name`; throw new Error(e); 
          } if ('EACCES' === e.code) {
            throw new Error(`'${c}' not executable`); 
          } if (d) {
            const t = new l(1, 'commander.executeSubCommandAsync', '(error)'); t.nestedError = e, d(t); 
          } else {
            process.exit(1); 
          } 
        })), this.runningCommand = m; 
      }

      _dispatchSubcommand(t, e, i) {
        const s = this._findCommand(t);

        if (s || this.help({ error: !0 }), !s._executableHandler) {
          return s._parseCommand(e, i); 
        } this._executeSubCommand(s, e.concat(i)); 
      }

      _checkNumberOfArguments() {
        this._args.forEach(((t, e) => {
          t.required && null == this.args[e] && this.missingArgument(t.name()); 
        })), this._args.length > 0 && this._args[this._args.length - 1].variadic || this.args.length > this._args.length && this._excessArguments(this.args); 
      }

      _processArguments() {
        const t = (t, e, i) => {
          let s = e;

          if (null !== e && t.parseArg) {
            try {
              s = t.parseArg(e, i); 
            } catch (i) {
              if ('commander.invalidArgument' === i.code) {
                const s = `error: command-argument value '${e}' is invalid for argument '${t.name()}'. ${i.message}`; this._displayError(i.exitCode, i.code, s); 
              } throw i; 
            } 
          } return s; 
        }; this._checkNumberOfArguments(); const e = []; this._args.forEach(((i, s) => {
          let n = i.defaultValue; i.variadic ? s < this.args.length ? (n = this.args.slice(s), i.parseArg && (n = n.reduce(((e, s) => t(i, s, e)), i.defaultValue))) : void 0 === n && (n = []) : s < this.args.length && (n = this.args[s], i.parseArg && (n = t(i, n, i.defaultValue))), e[s] = n; 
        })), this.processedArgs = e; 
      }

      _chainOrCall(t, e) {
        return t && t.then && 'function' === typeof t.then ? t.then((() => e())) : e(); 
      }

      _chainOrCallHooks(t, e) {
        let i = t; const s = []; return f(this).reverse().filter((t => void 0 !== t._lifeCycleHooks[e])).forEach((t => {
          t._lifeCycleHooks[e].forEach((e => {
            s.push({ hookedCommand: t, callback: e }); 
          })); 
        })), 'postAction' === e && s.reverse(), s.forEach((t => {
          i = this._chainOrCall(i, (() => t.callback(t.hookedCommand, this))); 
        })), i; 
      }

      _parseCommand(t, e) {
        const i = this.parseOptions(e);

        if (this._parseOptionsEnv(), t = t.concat(i.operands), e = i.unknown, this.args = t.concat(e), t && this._findCommand(t[0])) {
          return this._dispatchSubcommand(t[0], t.slice(1), e); 
        } if (this._hasImplicitHelpCommand() && t[0] === this._helpCommandName) {
          return 1 === t.length && this.help(), this._dispatchSubcommand(t[1], [], [this._helpLongFlag]); 
        } if (this._defaultCommandName) {
          return g(this, e), this._dispatchSubcommand(this._defaultCommandName, t, e); 
        } !this.commands.length || 0 !== this.args.length || this._actionHandler || this._defaultCommandName || this.help({ error: !0 }), g(this, i.unknown), this._checkForMissingMandatoryOptions();

        const s = () => {
          i.unknown.length > 0 && this.unknownOption(i.unknown[0]); 
        }; const n = `command:${this.name()}`;

        if (this._actionHandler) {
          let i; return s(), this._processArguments(), i = this._chainOrCallHooks(i, 'preAction'), i = this._chainOrCall(i, (() => this._actionHandler(this.processedArgs))), this.parent && this.parent.emit(n, t, e), i = this._chainOrCallHooks(i, 'postAction'), i; 
        } if (this.parent && this.parent.listenerCount(n)) {
          s(), this._processArguments(), this.parent.emit(n, t, e); 
        } else if (t.length) {
          if (this._findCommand('*')) {
            return this._dispatchSubcommand('*', t, e); 
          } this.listenerCount('command:*') ? this.emit('command:*', t, e) : this.commands.length ? this.unknownCommand() : (s(), this._processArguments()); 
        } else {
          this.commands.length ? (s(), this.help({ error: !0 })) : (s(), this._processArguments()); 
        } 
      }

      _findCommand(t) {
        if (t) {
          return this.commands.find((e => e._name === t || e._aliases.includes(t))); 
        } 
      }

      _findOption(t) {
        return this.options.find((e => e.is(t))); 
      }

      _checkForMissingMandatoryOptions() {
        for (let t = this; t; t = t.parent) {
          t.options.forEach((e => {
            e.mandatory && void 0 === t.getOptionValue(e.attributeName()) && t.missingMandatoryOptionValue(e); 
          })); 
        } 
      }

      parseOptions(t) {
        const e = []; const i = []; let s = e; const n = t.slice();

        function r(t) {
          return t.length > 1 && '-' === t[0]; 
        } let o = null;

        for (;n.length;) {
          const t = n.shift();

          if ('--' === t) {
            s === i && s.push(t), s.push(...n); break; 
          } if (!o || r(t)) {
            if (o = null, r(t)) {
              const e = this._findOption(t);

              if (e) {
                if (e.required) {
                  const t = n.shift(); void 0 === t && this.optionMissingArgument(e), this.emit(`option:${e.name()}`, t); 
                } else if (e.optional) {
                  let t = null; n.length > 0 && !r(n[0]) && (t = n.shift()), this.emit(`option:${e.name()}`, t); 
                } else {
                  this.emit(`option:${e.name()}`); 
                }o = e.variadic ? e : null; continue; 
              } 
            } if (t.length > 2 && '-' === t[0] && '-' !== t[1]) {
              const e = this._findOption(`-${t[1]}`);

              if (e) {
                e.required || e.optional && this._combineFlagAndOptionalValue ? this.emit(`option:${e.name()}`, t.slice(2)) : (this.emit(`option:${e.name()}`), n.unshift(`-${t.slice(2)}`)); continue; 
              } 
            } if (/^--[^=]+=/.test(t)) {
              const e = t.indexOf('='); const i = this._findOption(t.slice(0, e));

              if (i && (i.required || i.optional)) {
                this.emit(`option:${i.name()}`, t.slice(e + 1)); continue; 
              } 
            } if (r(t) && (s = i), (this._enablePositionalOptions || this._passThroughOptions) && 0 === e.length && 0 === i.length) {
              if (this._findCommand(t)) {
                e.push(t), n.length > 0 && i.push(...n); break; 
              } if (t === this._helpCommandName && this._hasImplicitHelpCommand()) {
                e.push(t), n.length > 0 && e.push(...n); break; 
              } if (this._defaultCommandName) {
                i.push(t), n.length > 0 && i.push(...n); break; 
              } 
            } if (this._passThroughOptions) {
              s.push(t), n.length > 0 && s.push(...n); break; 
            }s.push(t); 
          } else {
            this.emit(`option:${o.name()}`, t); 
          } 
        } return { operands: e, unknown: i }; 
      }

      opts() {
        if (this._storeOptionsAsProperties) {
          const t = {}; const e = this.options.length;

          for (let i = 0; i < e; i ++) {
            const e = this.options[i].attributeName(); t[e] = e === this._versionOptionName ? this._version : this[e]; 
          } return t; 
        } return this._optionValues; 
      }

      _displayError(t, e, i) {
        this._outputConfiguration.outputError(`${i}\n`, this._outputConfiguration.writeErr), 'string' === typeof this._showHelpAfterError ? this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`) : this._showHelpAfterError && (this._outputConfiguration.writeErr('\n'), this.outputHelp({ error: !0 })), this._exit(t, e, i); 
      }

      _parseOptionsEnv() {
        this.options.forEach((t => {
          if (t.envVar && t.envVar in process.env) {
            const e = t.attributeName(); (void 0 === this.getOptionValue(e) || ['default', 'config', 'env'].includes(this.getOptionValueSource(e))) && (t.required || t.optional ? this.emit(`optionEnv:${t.name()}`, process.env[t.envVar]) : this.emit(`optionEnv:${t.name()}`)); 
          } 
        })); 
      }

      missingArgument(t) {
        const e = `error: missing required argument '${t}'`; this._displayError(1, 'commander.missingArgument', e); 
      }

      optionMissingArgument(t) {
        const e = `error: option '${t.flags}' argument missing`; this._displayError(1, 'commander.optionMissingArgument', e); 
      }

      missingMandatoryOptionValue(t) {
        const e = `error: required option '${t.flags}' not specified`; this._displayError(1, 'commander.missingMandatoryOptionValue', e); 
      }

      unknownOption(t) {
        if (this._allowUnknownOption) {
          return; 
        } let e = '';

        if (t.startsWith('--') && this._showSuggestionAfterError) {
          let i = []; let s = this;

          do {
            const t = s.createHelp().visibleOptions(s).filter((t => t.long)).map((t => t.long)); i = i.concat(t), s = s.parent; 
          } while (s && !s._enablePositionalOptions); e = m(t, i); 
        } const i = `error: unknown option '${t}'${e}`; this._displayError(1, 'commander.unknownOption', i); 
      }

      _excessArguments(t) {
        if (this._allowExcessArguments) {
          return; 
        } const e = this._args.length; const i = 1 === e ? '' : 's'; const s = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ''}. Expected ${e} argument${i} but got ${t.length}.`; this._displayError(1, 'commander.excessArguments', s); 
      }

      unknownCommand() {
        const t = this.args[0]; let e = '';

        if (this._showSuggestionAfterError) {
          const i = []; this.createHelp().visibleCommands(this).forEach((t => {
            i.push(t.name()), t.alias() && i.push(t.alias()); 
          })), e = m(t, i); 
        } const i = `error: unknown command '${t}'${e}`; this._displayError(1, 'commander.unknownCommand', i); 
      }

      version(t, e, i) {
        if (void 0 === t) {
          return this._version; 
        } this._version = t, e = e || '-V, --version', i = i || 'output the version number'; const s = this.createOption(e, i); return this._versionOptionName = s.attributeName(), this.options.push(s), this.on(`option:${s.name()}`, (() => {
          this._outputConfiguration.writeOut(`${t}\n`), this._exit(0, 'commander.version', t); 
        })), this; 
      }

      description(t, e) {
        return void 0 === t && void 0 === e ? this._description : (this._description = t, e && (this._argsDescription = e), this); 
      }

      alias(t) {
        if (void 0 === t) {
          return this._aliases[0]; 
        } let e = this;

        if (0 !== this.commands.length && this.commands[this.commands.length - 1]._executableHandler && (e = this.commands[this.commands.length - 1]), t === e._name) {
          throw new Error("Command alias can't be the same as its name"); 
        } return e._aliases.push(t), this; 
      }

      aliases(t) {
        return void 0 === t ? this._aliases : (t.forEach((t => this.alias(t))), this); 
      }

      usage(t) {
        if (void 0 === t) {
          if (this._usage) {
            return this._usage; 
          } const t = this._args.map((t => h(t))); return [].concat(this.options.length || this._hasHelpOption ? '[options]' : [], this.commands.length ? '[command]' : [], this._args.length ? t : []).join(' '); 
        } return this._usage = t, this; 
      }

      name(t) {
        return void 0 === t ? this._name : (this._name = t, this); 
      }

      helpInformation(t) {
        const e = this.createHelp(); return void 0 === e.helpWidth && (e.helpWidth = t && t.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth()), e.formatHelp(this, e); 
      }

      _getHelpContext(t) {
        const e = { error: Boolean((t = t || {}).error) }; let i; return i = e.error ? t => this._outputConfiguration.writeErr(t) : t => this._outputConfiguration.writeOut(t), e.write = t.write || i, e.command = this, e; 
      }

      outputHelp(t) {
        let e; 'function' === typeof t && (e = t, t = void 0); const i = this._getHelpContext(t); f(this).reverse().forEach((t => t.emit('beforeAllHelp', i))), this.emit('beforeHelp', i); let s = this.helpInformation(i);

        if (e && (s = e(s), 'string' !== typeof s && !Buffer.isBuffer(s))) {
          throw new Error('outputHelp callback must return a string or a Buffer'); 
        } i.write(s), this.emit(this._helpLongFlag), this.emit('afterHelp', i), f(this).forEach((t => t.emit('afterAllHelp', i))); 
      }

      helpOption(t, e) {
        if ('boolean' === typeof t) {
          return this._hasHelpOption = t, this; 
        } this._helpFlags = t || this._helpFlags, this._helpDescription = e || this._helpDescription; const i = u(this._helpFlags); return this._helpShortFlag = i.shortFlag, this._helpLongFlag = i.longFlag, this; 
      }

      help(t) {
        this.outputHelp(t); let e = process.exitCode || 0; 0 === e && t && 'function' !== typeof t && t.error && (e = 1), this._exit(e, 'commander.help', '(outputHelp)'); 
      }

      addHelpText(t, e) {
        const i = [
          'beforeAll',
          'before',
          'after',
          'afterAll'
        ];

        if (!i.includes(t)) {
          throw new Error(`Unexpected value for position to addHelpText.\nExpecting one of '${i.join("', '")}'`); 
        } const s = `${t}Help`; return this.on(s, (t => {
          let i; i = 'function' === typeof e ? e({ error: t.error, command: t.command }) : e, i && t.write(`${i}\n`); 
        })), this; 
      }
    }

    function g(t, e) {
      t._hasHelpOption && e.find((e => e === t._helpLongFlag || e === t._helpShortFlag)) && (t.outputHelp(), t._exit(0, 'commander.helpDisplayed', '(outputHelp)')); 
    }

    function _(t) {
      return t.map((t => {
        if (!t.startsWith('--inspect')) {
          return t; 
        } let e; let i; let s = '127.0.0.1'; let n = '9229'; return null !== (i = t.match(/^(--inspect(-brk)?)$/)) ? e = i[1] : null !== (i = t.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) ? (e = i[1], /^\d+$/.test(i[3]) ? n = i[3] : s = i[3]) : null !== (i = t.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) && (e = i[1], s = i[3], n = i[4]), e && '0' !== n ? `${e}=${s}:${parseInt(n) + 1}` : t; 
      })); 
    }

    function f(t) {
      const e = [];

      for (let i = t; i; i = i.parent) {
        e.push(i); 
      } return e; 
    }e.Command = d; 
  }, 481: (t, e) => {
    class i extends Error {
      constructor(t, e, i) {
        super(i), Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = e, this.exitCode = t, this.nestedError = void 0; 
      }
    }

    e.CommanderError = i, e.InvalidArgumentError = class extends i {
      constructor(t) {
        super(1, 'commander.invalidArgument', t), Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name; 
      }
    }; 
  }, 120: (t, e, i) => {
    const { humanReadableArgName:s } = i(341); e.Help = class {
      constructor() {
        this.helpWidth = void 0, this.sortSubcommands = !1, this.sortOptions = !1; 
      }

      visibleCommands(t) {
        const e = t.commands.filter((t => !t._hidden));

        if (t._hasImplicitHelpCommand()) {
          const [, i, s] = t._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/); const n = t.createCommand(i).helpOption(!1); n.description(t._helpCommandDescription), s && n.arguments(s), e.push(n); 
        } return this.sortSubcommands && e.sort(((t, e) => t.name().localeCompare(e.name()))), e; 
      }

      visibleOptions(t) {
        const e = t.options.filter((t => !t.hidden)); const i = t._hasHelpOption && t._helpShortFlag && !t._findOption(t._helpShortFlag); const s = t._hasHelpOption && !t._findOption(t._helpLongFlag);

        if (i || s) {
          let n; n = i ? s ? t.createOption(t._helpFlags, t._helpDescription) : t.createOption(t._helpShortFlag, t._helpDescription) : t.createOption(t._helpLongFlag, t._helpDescription), e.push(n); 
        } if (this.sortOptions) {
          const t = t => (t.short ? t.short.replace(/^-/, '') : t.long.replace(/^--/, '')); e.sort(((e, i) => t(e).localeCompare(t(i)))); 
        } return e; 
      }

      visibleArguments(t) {
        return t._argsDescription && t._args.forEach((e => {
          e.description = e.description || t._argsDescription[e.name()] || ''; 
        })), t._args.find((t => t.description)) ? t._args : []; 
      }

      subcommandTerm(t) {
        const e = t._args.map((t => s(t))).join(' '); return t._name + (t._aliases[0] ? `|${t._aliases[0]}` : '') + (t.options.length ? ' [options]' : '') + (e ? ` ${e}` : ''); 
      }

      optionTerm(t) {
        return t.flags; 
      }

      argumentTerm(t) {
        return t.name(); 
      }

      longestSubcommandTermLength(t, e) {
        return e.visibleCommands(t).reduce(((t, i) => Math.max(t, e.subcommandTerm(i).length)), 0); 
      }

      longestOptionTermLength(t, e) {
        return e.visibleOptions(t).reduce(((t, i) => Math.max(t, e.optionTerm(i).length)), 0); 
      }

      longestArgumentTermLength(t, e) {
        return e.visibleArguments(t).reduce(((t, i) => Math.max(t, e.argumentTerm(i).length)), 0); 
      }

      commandUsage(t) {
        let e = t._name; t._aliases[0] && (e = `${e}|${t._aliases[0]}`); let i = '';

        for (let e = t.parent; e; e = e.parent) {
          i = `${e.name()} ${i}`; 
        } return `${i + e} ${t.usage()}`; 
      }

      commandDescription(t) {
        return t.description(); 
      }

      subcommandDescription(t) {
        return t.description(); 
      }

      optionDescription(t) {
        const e = []; return t.argChoices && !t.negate && e.push(`choices: ${t.argChoices.map((t => JSON.stringify(t))).join(', ')}`), void 0 === t.defaultValue || t.negate || e.push(`default: ${t.defaultValueDescription || JSON.stringify(t.defaultValue)}`), void 0 !== t.envVar && e.push(`env: ${t.envVar}`), e.length > 0 ? `${t.description} (${e.join(', ')})` : t.description; 
      }

      argumentDescription(t) {
        const e = [];

        if (t.argChoices && e.push(`choices: ${t.argChoices.map((t => JSON.stringify(t))).join(', ')}`), void 0 !== t.defaultValue && e.push(`default: ${t.defaultValueDescription || JSON.stringify(t.defaultValue)}`), e.length > 0) {
          const i = `(${e.join(', ')})`; return t.description ? `${t.description} ${i}` : i; 
        } return t.description; 
      }

      formatHelp(t, e) {
        const i = e.padWidth(t, e); const s = e.helpWidth || 80;

        function n(t, n) {
          if (n) {
            const r = `${t.padEnd(i + 2)}${n}`; return e.wrap(r, s - 2, i + 2); 
          } return t; 
        }

        function r(t) {
          return t.join('\n').replace(/^/gm, ' '.repeat(2)); 
        } let o = [`Usage: ${e.commandUsage(t)}`, '']; const a = e.commandDescription(t); a.length > 0 && (o = o.concat([a, ''])); const h = e.visibleArguments(t).map((t => n(e.argumentTerm(t), e.argumentDescription(t)))); h.length > 0 && (o = o.concat(['Arguments:', r(h), ''])); const l = e.visibleOptions(t).map((t => n(e.optionTerm(t), e.optionDescription(t)))); l.length > 0 && (o = o.concat(['Options:', r(l), ''])); const p = e.visibleCommands(t).map((t => n(e.subcommandTerm(t), e.subcommandDescription(t)))); return p.length > 0 && (o = o.concat(['Commands:', r(p), ''])), o.join('\n'); 
      }

      padWidth(t, e) {
        return Math.max(e.longestOptionTermLength(t, e), e.longestSubcommandTermLength(t, e), e.longestArgumentTermLength(t, e)); 
      }

      wrap(t, e, i, s = 40) {
        if (t.match(/[\n]\s+/)) {
          return t; 
        } const n = e - i;

        if (n < s) {
          return t; 
        } const r = t.substr(0, i); const o = t.substr(i); const a = ' '.repeat(i); const h = new RegExp(`.{1,${n - 1}}([\\s​]|$)|[^\\s​]+?([\\s​]|$)`, 'g'); return r + (o.match(h) || []).map(((t, e) => ('\n' === t.slice(-1) && (t = t.slice(0, t.length - 1)), (e > 0 ? a : '') + t.trimRight()))).join('\n'); 
      }
    }; 
  }, 190: (t, e, i) => {
    const { InvalidArgumentError:s } = i(481);

    function n(t) {
      let e; let i; const s = t.split(/[ |,]+/); return s.length > 1 && !/^[[<]/.test(s[1]) && (e = s.shift()), i = s.shift(), !e && /^-[^-]$/.test(i) && (e = i, i = void 0), { shortFlag: e, longFlag: i }; 
    }e.Option = class {
      constructor(t, e) {
        this.flags = t, this.description = e || '', this.required = t.includes('<'), this.optional = t.includes('['), this.variadic = /\w\.\.\.[>\]]$/.test(t), this.mandatory = !1; const i = n(t); this.short = i.shortFlag, this.long = i.longFlag, this.negate = !1, this.long && (this.negate = this.long.startsWith('--no-')), this.defaultValue = void 0, this.defaultValueDescription = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0; 
      }

      default(t, e) {
        return this.defaultValue = t, this.defaultValueDescription = e, this; 
      }

      env(t) {
        return this.envVar = t, this; 
      }

      argParser(t) {
        return this.parseArg = t, this; 
      }

      makeOptionMandatory(t = !0) {
        return this.mandatory = Boolean(t), this; 
      }

      hideHelp(t = !0) {
        return this.hidden = Boolean(t), this; 
      }

      _concatValue(t, e) {
        return e !== this.defaultValue && Array.isArray(e) ? e.concat(t) : [t]; 
      }

      choices(t) {
        return this.argChoices = t, this.parseArg = (e, i) => {
          if (!t.includes(e)) {
            throw new s(`Allowed choices are ${t.join(', ')}.`); 
          } return this.variadic ? this._concatValue(e, i) : e; 
        }, this; 
      }

      name() {
        return this.long ? this.long.replace(/^--/, '') : this.short.replace(/^-/, ''); 
      }

      attributeName() {
        return this.name().replace(/^no-/, '').split('-').reduce(((t, e) => t + e[0].toUpperCase() + e.slice(1))); 
      }

      is(t) {
        return this.short === t || this.long === t; 
      }
    }, e.splitOptionFlags = n; 
  }, 531: (t, e) => {
    e.suggestSimilar = function (t, e) {
      if (!e || 0 === e.length) {
        return ''; 
      } e = Array.from(new Set(e)); const i = t.startsWith('--'); i && (t = t.slice(2), e = e.map((t => t.slice(2)))); let s = []; let n = 3; return e.forEach((e => {
        if (e.length <= 1) {
          return; 
        } const i = (function (t, e) {
          if (Math.abs(t.length - e.length) > 3) {
            return Math.max(t.length, e.length); 
          } const i = [];

          for (let e = 0; e <= t.length; e ++) {
            i[e] = [e]; 
          }

          for (let t = 0; t <= e.length; t ++) {
            i[0][t] = t; 
          }

          for (let s = 1; s <= e.length; s ++) {
            for (let n = 1; n <= t.length; n ++) {
              let r = 1; r = t[n - 1] === e[s - 1] ? 0 : 1, i[n][s] = Math.min(i[n - 1][s] + 1, i[n][s - 1] + 1, i[n - 1][s - 1] + r), n > 1 && s > 1 && t[n - 1] === e[s - 2] && t[n - 2] === e[s - 1] && (i[n][s] = Math.min(i[n][s], i[n - 2][s - 2] + 1)); 
            } 
          } return i[t.length][e.length]; 
        }(t, e)); const r = Math.max(t.length, e.length); (r - i) / r > 0.4 && (i < n ? (n = i, s = [e]) : i === n && s.push(e)); 
      })), s.sort(((t, e) => t.localeCompare(e))), i && (s = s.map((t => `--${t}`))), s.length > 1 ? `\n(Did you mean one of ${s.join(', ')}?)` : 1 === s.length ? `\n(Did you mean ${s[0]}?)` : ''; 
    }; 
  } }; const e = {};

  function i(s) {
    const n = e[s];

    if (void 0 !== n) {
      return n.exports; 
    } const r = e[s] = { exports: {}}; return t[s](r, r.exports, i), r.exports; 
  }i.c = e, i(i.s = 449); 
})();
// # sourceMappingURL=index.js.map