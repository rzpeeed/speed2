export class SensEngine {
    constructor(config) {
        this.lastX = 0; this.lastY = 0;
        this.smoothVelocity = 0;
        this.isFiring = false;
        this.config = {
            lowSensLimit: 0.2,
            lockThreshold: 15,
            deadzone: 1.5,
            recoilForce: 2.1,
            recoilJitter: 0.12,
            ...config
        };
    }
    getBezierSens(t) {
        return Math.pow(1 - t, 3) * 0.5 + 3 * Math.pow(1 - t, 2) * t * 1.2 + 3 * (1 - t) * Math.pow(t, 2) * 0.8 + Math.pow(t, 3) * 1.0;
    }
    setFiring(state) { this.isFiring = state; }
    processMove(currentX, currentY) {
        let dx = currentX - this.lastX;
        let dy = currentY - this.lastY;
        if (this.isFiring) {
            dy += this.config.recoilForce;
            dx += (Math.random() - 0.5) * this.config.recoilJitter;
        }
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < this.config.deadzone && !this.isFiring) return { x: 0, y: 0 };
        this.smoothVelocity = (this.smoothVelocity * 0.6) + (dist * 0.4);
        const t = Math.min(this.smoothVelocity / 50, 1);
        const mult = this.getBezierSens(t);
        let fx = dx * mult;
        let fy = dy * mult;
        if (Math.abs(dx) > this.config.lockThreshold) fx = Math.sign(dx) * this.config.lockThreshold;
        this.lastX = currentX;
        this.lastY = currentY;
        return { x: fx, y: fy };
    }
}