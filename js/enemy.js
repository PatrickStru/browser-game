function Enemy(game) {

    this.game = game;
    this.instance = this;

    var duration = null;
}

/* static variables */

// static counter for killed enemies
Enemy.killed = 0;

Enemy.prototype.create = function(x_offset, y_offset) {
    var x = this.game.world.width - x_offset;
    var y = this.game.world.height - y_offset;
    this.instance = this.game.add.sprite(x , y, 'baddie');
}

Enemy.prototype.setAnimation = function() {
    this.instance.animations.add('left', [0, 1], 8, true);
    this.instance.animations.add('right', [2, 3], 8, true);
}

Enemy.prototype.setPhysics = function() {
    this.game.physics.arcade.enable(this.instance);
}

Enemy.prototype.moveLeft = function() {
    this.instance.animations.play('left');
    this.instance.body.velocity.x = -100;
}

Enemy.prototype.inXRange = function() {
    if (this.instance.x > -this.instance.width && this.instance.body != null) {
        return true;
    } else {
        return false;
    }
}

Enemy.prototype.checkCollisionWithWeapon = function(weapon) {
    if (weapon != null && this.instance != null) {
        this.game.physics.arcade.overlap(weapon, this.instance, this.removeAfterHit, null, this);
    }
}

Enemy.prototype.removeAfterHit = function(weapon) {
    // play some awesome smash audio
    this.game.add.audio('explosion').play();

    this.destroy();
    if (weapon != null) {
        weapon.kill();
    }
    Enemy.killed++;
}

Enemy.prototype.getKilledEnemies = function() {
    return Enemy.killed;
}

Enemy.prototype.destroy = function() {
    if (this.instance != null) {
        this.instance.destroy();
    }
}

Enemy.prototype.getInstance = function() {
    return this.instance;
}