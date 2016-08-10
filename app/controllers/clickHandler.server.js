var Poll	=	require('../models/poll.js');
var	Person	= require('../models/person.js');
var shortid = require('../../node_modules/shortid');



function ClickHandler () {
 

this.update=function(req,res){
	
 	var arrayopciones;
 	var arraycontenedor = [];
 	var op1				= req.body.op1;
 	var op2				= req.body.op2;
 	var op3				= req.body.op3;
 	var id_poll			= req.body.idpoll;
 
 	
	function addelement(element){
		arrayopciones={title:element,vote:0}; 
		arraycontenedor.push(arrayopciones); 
	}

	

	if(op1!=""){addelement(op1)}
	if(op2!=""){addelement(op2)}
	if(op3!=""){addelement(op3)}
	
 	Poll.update({_id:id_poll },{$pushAll: {options:arraycontenedor}},{upsert:true},function(err){
        if(err){
                console.log(err);
        }else{
                console.log("Successfully added");
        }
	});


	res.redirect('/pool/'+id_poll);

};  
   
   
   
this.pooling=function(req,res){
	
	var id_vote		= req.body.vote;
	var idPoll		= req.body.id_poll;
	var iduser		= req.cookies.id;




	if (typeof req.user !== 'undefined') {
		iduser = req.user.twitter.id;//saving users id for never polling again
	}


	Poll.update({'options._id': id_vote}, {'$inc': {
    	'options.$.vote': 1
	}}, function(err,doc) {});


	Poll.findByIdAndUpdate(
    	idPoll,
    	{$push: {idPoller: {id: iduser}}},
    	{safe: true, upsert: true},
    	function(err, model) {});	

	res.redirect('/pool/'+idPoll);

};


this.addPolls= function(req,res){

		// getting user's information
	 var username		 = req.user.twitter.username;
	 var displayName	 = req.user.twitter.displayName;
     var  id			 = req.user.twitter.id;
 	 var titulo			 = req.body.title;
 	 var arraycontenedor = [];
 	 var arrayopciones;
 			 
	//saving  the options of the poll in  array
	for(var key in req.body.mitexto) {
 
		arrayopciones={title:req.body.mitexto[key],vote:0}; 
		arraycontenedor.push(arrayopciones); 	  		
 	 
 	  }
	
	//creating new person and poll	  
	var person= new Person({
		_id			: id,
		username	: username,
		displayName	: displayName
		});
	
	person.save(function(){
		
		var poll = new Poll({
  			_creator	: person._id,
    		title		: titulo,
			options		: arraycontenedor
		});
  		
  		poll.save(function (err,doc) {
  			//console.log(doc);
  			});
			
		
	});	  
 
  	var m="Encuesta agregada con exito! puedes ver todas las encuestas ";
	res.render('index',{username:displayName,message:m});
 	  
 	  
};




this.getPolls= function(req,res){

	var displayName='';

	
	


	if (typeof req.user !== 'undefined') {
		
		 displayName	=req.user.twitter.displayName;
		}
		
		

		Poll
		.find({})
		.exec(function (err, pollsdocs) {
		 if (err) return (err);
		
		res.render('index',{
			username	:displayName,
			allpolls		:pollsdocs
			
		});
		});

};





this.getMyPolls= function(req,res){
 		
 		
 		var id				=req.user.twitter.id;
 		var displayName		=req.user.twitter.displayName;
 		
		
		Poll
		.find({_creator:id})
		.exec(function (err, pollsdocs) {
		 if (err) return (err);
		
		res.render('index',{
			username	:displayName,
			allpolls		:pollsdocs, 
			mypoll		:'Mis '
			
		});
		
		console.log(pollsdocs._id);

		});
};
  

  
this.erasePoll= function(req,res){
	 var idPoll=	 req.params.id;
	
    Poll
    .findByIdAndRemove(idPoll, function (err,offer){
    if(err) { throw err; }
    // ...
})

	res.redirect('/');
	
};




  this.getSelected= function(req,res){
  		
  		var displayName='';
		var iduser='';
		var idPoll=	 req.url.split('/')[2];
		var mess='Gracias por votar ! Ver otras encuestas ';
		var style='display:none';
 		var owner='';
 		if (typeof req.cookies.id == 'undefined') {
	
		iduser=shortid.generate();
		 
		 res.cookie('id', iduser, {maxAge : 8.64e+7});//24 hour
			console.log(iduser+' create');
		}
		
	
  		if (typeof req.user != 'undefined') {
		 
		 displayName		= req.user.twitter.displayName;
		 iduser				= req.user.twitter.id;
		 
  		}else{
  				//get id user
		iduser	=	req.cookies.id;
		console.log('usercooki');
  		}
		 	
		 	
		 	Poll.find({_id:idPoll,'idPoller.id': iduser },function(err,doc){
		 		
		 		
		 		
		 		if (!doc.length) {
    			mess='';
    			style='';
    				}
		 		
		 	  	Poll
		.findOne({_id:idPoll})
		.exec(function (err, ps) {
		 if (err) return (err);
		 
		 if (ps._creator==iduser){
		 owner="owner";
		 	
		 }
		 
		 
		 	 res.render('index', { 
    			username		: displayName,
    			pollSelected	: ps,
    			messagepoll		: mess,
    			displai			: style,
    			owner			: owner
    			
    					}); 
   
		});
		 	
		 	});
		 
		
	
     	
   
		
};



}
module.exports = ClickHandler;
	
