# babel-plugin-inflow
Babel code injection plugin.It can be used together with burying tools. To avoid damaging the integrity of code structure, you can also do different embedding actions for different environments or modes.This plugin supports babel6 and babel7.And supports react.

babel代码注入插件。可结合埋点工具一起使用。避免破坏代码结构完整性，也可以针对不同环境或者模式做不同埋点动作。此插件支持babel6以及babel7。并且支持react

# Installation
```
npm install --save-dev babel-plugin-inflow
```

Now edit your `.babelrc` to include `babel-plugin-inflow`.  

```js
{
  "presets": ["es2015", "stage-0"],
  "plugins": ["babel-plugin-inflow"],
}
```
# example

```js
/*@inflow inFlowfun(num)*/
const afun=(num)=>{
    console.log('afun',num)
}
//@inflow inFlowfun(num)
function bfun(num){
    console.log('bfun',num)
}

class Index extends React.Component {
  /*@inflow test3()*/  
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
    };
  }
  /*@inflow test4()*/  
  testfun(){
    console.log(1)
  }
  /*@inflow test5()*/  
  testProp=()=>{
    console.log(1)
  }  
}  
```
after using babel-plugin-inflow, the above code is translated into
在使用了babel-plugin-inflow后，以上代码的被翻译成了
```js
const afun=(num)=>{
    inFlowfun(num)
    console.log('afun',num)
}
function bfun(num){
    inFlowfun(num)
    console.log('bfun',num)
}

class Index extends React.Component {
  constructor(props) {
    test3()
    super(props);
    this.state = {
      user: '',
      password: '',
    };
  }
  testfun(){
    test4()
    console.log(1)
  } 
  testProp=()=>{
    test5()
    console.log(1)
  }  
}  
```
## configuration parameter
The. Inflow file is at the same level as. Babelrc. The specific parameters are as follows
.inflow文件和.babelrc同一层级。具体参数如下
```js
{
    "key":"inflow", 
    "debug":[{      
       "key":"process.env.NODE_ENV",
       "value":"develop",
       "debugKey":"inFlowfun"
    }]
}
```
Inflow indicates the flag bit of buried point identification method, and inflow is the default value
inflow 表示识别埋点方法标志位，inflow为默认值

The corresponding content in debug can be understood as 
if(process.env.NODE_ENV=="develop"){
replace the keyword zhe with console.log. If the debugkey is empty or does not exist, then if the condition of if is met, the point will not be buried}

debug中对应的内容可以理解为，
if(process.env.NODE_ENV=="develop"){
将关键字zhuge替换为console.log，如果debugkey为空或者不存在，则满足if的条件时不埋点}

If .Inflow is configured as above, the above example will be translated as follows

如果.inflow配置如上，则以上的例子会被翻译为如下：

```js
const afun=(num)=>{
    if(process.env.NODE_ENV=="develop"){
        console.log(num)
    } 
    else{
        inFlowfun(num)
    }
    console.log('afun',num)
}

```

## License

MIT

