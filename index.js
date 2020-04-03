const fs=require('fs');
var babylon = '';
var rkey='';
var inflow_file=__dirname +'/../../.inflow';
var babylon_file=__dirname+'/../babylon';
var dire='@inflow';
var debug_t=[];
fs.access(babylon_file, fs.constants.F_OK, (err) => {
  if(err){
    babylon = require('@babel/parser');
  }
  else{
    babylon = require('babylon');
  }
});

fs.access(inflow_file, fs.constants.F_OK, (err) => {
  if(err){
    rkey='';
  }
  else{
    rkey=fs.readFileSync(inflow_file);
    if(rkey && rkey.toString()){
      const dk=JSON.parse(rkey);
      if(dk && dk.key){
        dire='@'+dk.key;
      }
      if(dk && dk.debug){
        debug_t=dk.debug;

      }
    }
  }
});



function r_funName(funName,t){
  var rfilename='';
  if(debug_t && debug_t.length){
    for(var i=0;i<debug_t.length;i++){
      var list=debug_t[i];
      var DISABLE_PLACE=list.key;
      var DISKEY=list.value;
      var DEBUG_KEY=list.debugKey;
      if(DISABLE_PLACE && DISKEY){
        rfilename+=`if(${DISABLE_PLACE}==="${DISKEY}"){${r_testkey(funName,DEBUG_KEY)}}`;
      }
    }
    rfilename+=`else{${funName}}`;
    funName=rfilename;
  }
  funName=babylon.parse(funName);
  return funName;
}
function r_testkey(funName,test_key){
  if(test_key){
   var rkey=test_key+'\\(';
   funName=funName.replace(new RegExp(rkey),'console.log(');
  }
  return funName;
}
const mytest=({ types: t })=>{
  return {
    visitor: {
      FunctionDeclaration(path){
        const p=path.parent.body;
        if(!p){return;}
        for(var j=0;j<p.length;j++){
          let commentsBody=p[j].leadingComments;
          if(commentsBody){
            for(var i=0;i<commentsBody.length;i++){
              if(commentsBody[i].value.indexOf(dire)>=0 && path.key==j){
                let funName=commentsBody[i].value.split(dire)[1].replace(/(^\s*)|(\s*$)/g, '');
                if(!path.hasAddPourKey || path.hasAddPourKey.indexOf(funName)<0){
                  path.get('body').unshiftContainer('body',r_funName(funName,t));
                  if(!path.hasAddPourKey){path.hasAddPourKey=[];}
                  path.hasAddPourKey.push(funName);
                }
              }
            }
          }
        }
      },
      ArrowFunctionExpression(path){
        const p=path.parentPath.parent;
        if(!p){return;}
          let commentsBody=p.leadingComments;
          if(commentsBody){
            for(var i=0;i<commentsBody.length;i++){
              if(commentsBody[i].value.indexOf(dire)>=0 ){
              	let funName=commentsBody[i].value.split(dire)[1].replace(/(^\s*)|(\s*$)/g, '');
              	if(!path.hasAddPourKey || path.hasAddPourKey.indexOf(funName)<0){
                  path.get('body').unshiftContainer('body',r_funName(funName,t));
	              	if(!path.hasAddPourKey){path.hasAddPourKey=[];}
	              	path.hasAddPourKey.push(funName);
              	}
              }
            }
          }
      },
      Class(paths){
        const body = paths.get('body');
         for (const path of body.get('body')) {
			      let commentsBody=path.node.leadingComments;
	          if(commentsBody && commentsBody.length){
	            for(var i=0;i<commentsBody.length;i++){
	              if(commentsBody[i].value.indexOf(dire)>=0
	              	&& path.get('value').container.type=='ClassProperty'){
	              	let funName=commentsBody[i].value.split(dire)[1].replace(/(^\s*)|(\s*$)/g, '');
	              	if(!path.hasAddPourKey || path.hasAddPourKey.indexOf(funName)<0){
                    path.get('value').get('body').unshiftContainer('body',r_funName(funName,t));
		              	if(!path.hasAddPourKey){path.hasAddPourKey=[];}
		              	path.hasAddPourKey.push(funName);
	              	}

	              }
	              else if(commentsBody[i].value.indexOf(dire)>=0
	              	&& path.get('body').container.type=='ClassMethod'){
	              	let funName=commentsBody[i].value.split(dire)[1].replace(/(^\s*)|(\s*$)/g, '');
	              	if(!path.hasAddPourKey || path.hasAddPourKey.indexOf(funName)<0){
                    path.get('body').unshiftContainer('body',r_funName(funName,t));
		              	if(!path.hasAddPourKey){path.hasAddPourKey=[];}
		              	path.hasAddPourKey.push(funName);
	              	}
	              }
	            }
	          }
         }

      }
    }
  };
};
module.exports = mytest;