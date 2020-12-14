let obj_player = new GameObject("obj_player",32,32);

obj_player.friction = 1.5;
obj_player.collisionBox = [34, 24, 34, 30];
 
obj_player.rollPhase = 0;
obj_player.attackPhase = 0;
obj_player.attackQueued = false;

//Don't repeat the same attack animation twice in a row
obj_player.lastAttackAnim = -1;
obj_player.gravityDirection = 270;
obj_player.gravity = 2;
obj_player.terminalVelocity = 2.2


obj_player.dirFacing = 1;

obj_player.run = function() { this.setSprite(this.sprs.run,-1,-1,false,this.dirFacing,1,true); }
obj_player.onstep = function() {

	this.hspeed = Math.min(27,this.hspeed);
	this.vspeed = Math.min(20,this.vspeed);
	
	if(this.rollPhase == 0 && this.attackPhase == 0) {
	
		if(game.checkKey("d")) { this.dirFacing=1; obj_player.run(); this.hspeed=5; }
		if(game.checkKey("a")) { this.dirFacing=-1; obj_player.run(); this.hspeed=-5; }
		
		if(game.checkKey("s")) { obj_player.run(); this.vspeed=5; this.hspeed = this.hspeed*this.dirFacing*12;}
		if(game.checkKey("w") && this.fallSpeed <= 0) {   this.vspeed=-24; }
		
		if(this.vspeed < 0) {
			this.setSprite(this.sprs.jump,0,0,.8);
			this.sprite.scaleX = this.dirFacing;
			this.sprs.jump.onanimationend = fn=>{this.sprs.jump.speed=0;}
		}
		else if(this.fallSpeed > this.gravity) {
			this.setSprite(this.sprs.fall);
			this.sprite.scaleX = this.dirFacing;
		}
		else if(!game.checkKey("d") && !game.checkKey("a") && !game.checkKey("s") && !game.checkKey("w")) {
			this.setSprite(this.sprs.idle,-1,-1,false,this.dirFacing); 
		}
		
		if(game.checkKey("i") && this.rollPhase===0) {
		
			if(this.fallSpeed > this.gravity) { this.vspeed-=4; }
			this.setSprite(this.sprs.roll,-1,-1,false,this.dirFacing);
			this.hspeed = this.dirFacing*14;
			this.rollPhase = 1;
			
		}
		if(game.checkKey("k") && this.rollPhase===0 && this.attackPhase === 0) {
		
			this.attack();
			
		}
	}
	else if(this.rollPhase !== 0) {
		if(game.checkKey("k")) { this.attackQueued = true; }
	}
	
	if(this.x > 640 || this.x < 0 || this.y > 480 || this.y < 0) { this.wrap(); }
	
	this.setDepth(-this.y-50);
}

obj_player.attack = function(newSpeed = .5) {

	//Pick a random attack animation, and repick as long as it's the last one we did
	let newAttackAnim = game.irandom(0,this.sprs.attack.length-1);
	while(newAttackAnim === this.lastAttackAnim) { newAttackAnim = game.irandom(0,this.sprs.attack.length-1); }
	
	this.sprs.attack[newAttackAnim].speed = newSpeed;
	
	this.setSprite(this.sprs.attack[newAttackAnim],0,0,false,this.dirFacing);
	
	this.lastAttackAnim = newAttackAnim;
	this.attackPhase = 1;
	this.attackQueued = false;
	
	this.hspeed = (this.fallSpeed > this.gravity ? this.hspeed:0)+5*this.dirFacing;
	console.log(this.sprite.name,this.sprite.frame);
}

obj_player.sprs = {};
obj_player.sprs.idle = new Sprite("spr_player_idle", "objects/obj_player/sprites/HeroKnight.png",[0,100,100*2,100*3,100*4,100*5,100*6,100*7],0,100,55,100,55,.5);
obj_player.sprs.run = new Sprite("spr_player_run", "objects/obj_player/sprites/spr_run.png",[0,100,200,300,400,500,600,700,800,900],0,100,55,100,55,.5);
obj_player.sprs.roll = new Sprite("spr_player_roll", "objects/obj_player/sprites/spr_roll.png",[0,100,200,300,400,500,600,700,800],0,100,55,100,55,.5);
obj_player.sprs.roll.onanimationend = function() { 

	obj_player.rollPhase=2;
	if(obj_player.attackQueued) { obj_player.attack(.7); }
	setTimeout(fn=>{obj_player.rollPhase=0;},50); 
}
obj_player.sprs.attack = [
	new Sprite("attack1",  "objects/obj_player/sprites/spr_attack1.png",[0,100,200,300,400,500],0,100,55,100,55,.5),
	new Sprite("attack2",  "objects/obj_player/sprites/spr_attack2.png",[0,100,200,300,400,500],0,100,55,100,55,.5),
	new Sprite("attack3",  "objects/obj_player/sprites/spr_attack3.png",[0,100,200,300,400,500,600,700],0,100,55,100,55,.5)
];
obj_player.sprs.attack.forEach(
	spr=>{
		spr.onanimationend = function(){
			obj_player.attackPhase=2;
			setTimeout(fn=>{obj_player.attackPhase=0;},1);
		}
	}
);

obj_player.sprs.jump = new Sprite("spr_player_jump",  "objects/obj_player/sprites/spr_jump.png",[0,100,200],0,100,55,100,55,.5);
obj_player.sprs.fall = new Sprite("spr_player_fall",  "objects/obj_player/sprites/spr_fall.png",[0,100,200],0,100,55,100,55,.5);

obj_player.sprite = obj_player.sprs.idle;