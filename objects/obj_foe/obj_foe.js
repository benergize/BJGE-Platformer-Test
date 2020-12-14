obj_foe = new GameObject("obj_foe",128,128,new Sprite("spr_foe_idle","objects/obj_foe/sprites/spr_bandit_idle.png",[0,48,48*2,48*3],0,48,48,48,48,.4));
obj_foe.sprs = {
	idle:new Sprite("spr_foe_idle","objects/obj_foe/sprites/spr_bandit_idle.png",[0,48,48*2,48*3],0,48,48,48,48,.4),
	hurt:new Sprite("spr_foe_hurt","objects/obj_foe/sprites/spr_bandit_hurt.png",[0,48],0,48,48,48,48,.4,false,fn=>{obj_foe.setSprite(obj_foe.sprs.idle)})
}
obj_foe.setDepth(-obj_foe.y-48);
obj_foe.iframes = 0;
obj_foe.friction = 1;
obj_foe.gravity = 1; 
obj_foe.gravityDirection=270;
obj_foe.terminalVelocity = 3;
obj_foe.collisionBox=[12,12,24,34]
obj_foe.onstep = function() {
	//this.wrap();
	this.iframes--;
	
	if(this.iframes <= 0) {
		let cols = obj_foe.getCollisions(-10,0,false);
		for(let c = 0; c < cols.length; c++) {
			
			if(cols[c].name === "obj_player") {
				
				if(cols[c].sprite.name.indexOf("attack") !== -1) {
					this.setSprite(this.sprs.hurt);
					this.iframes = 15;
					this.hspeed= obj_player.hspeed/3+-5*Math.abs(obj_player.x-this.x)/(obj_player.x-this.x)
				}
			}
		}
	}
}