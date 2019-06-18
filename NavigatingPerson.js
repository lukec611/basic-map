
class RandomUtility {
    /**
     * @desc returns a random number between a and b
     * @note a is assumed to be less than b
     * @param {number} a
     * @param {number} b 
     * @returns {number}
     */
    static randomIntBetween(a, b) {
        return Math.floor(Math.random() * (b - a) + a);
    }
}

/**
 * @desc returns a random position on the map
 * @param {Bbox} map 
 * @param {Array<{ getBoundingBox(): Bbox }>} staticObjects 
 * @param {number} maxIterations - the maximum number of times to loop through trying to randomly
 * generate a position
 * @returns {{ x: number, y: number} | undefined}
 */
function getRandomPersonLocationOnMap(map, staticObjects, maxIterations = 100) {
    const getRandomPosition = () => ({
        x: RandomUtility.randomIntBetween(map.x, map.x + map.w),
        y: RandomUtility.randomIntBetween(map.x, map.x + map.h),
    });
    for (let i = 0; i < maxIterations; i++) {
        const position = getRandomPosition();
        const boundingBox = Person.createBoundingBox(position.x, position.y);
        if (!boundingBox.within(map)) continue;
        if (!boundingBox.intersectsWithAnyObject(staticObjects)) return position;
    }
    return undefined;
}

/**
 * @typedef {Object} PlanDetail
 * @property {number} moveToX
 * @property {number} moveToY
 * @property {number} facingAngle
 * @property {boolean} animateWalk
 * @property {PlanDetail|null} prevState 
 */

/**
 * @desc gets a list of positions surrounding a point
 * @param {number} x 
 * @param {number} y 
 * @param {number} stepSize 
 */
function getSurroundingPositions(x, y, stepSize) {
    return [
        { x: x + stepSize, y, angle: 0 },
        { x: x + stepSize, y: y + stepSize, angle: 45 },
        { x, y: y + stepSize, angle: 90 },
        { x: x - stepSize, y: y + stepSize, angle: 135 },
        { x: x - stepSize, y, angle: 180 },
        { x: x - stepSize, y: y - stepSize, angle: 225 },
        { x, y: y - stepSize, angle: 270 },
        { x: x + stepSize, y: y - stepSize, angle: 315 },
    ];
}

class Plan {
    /**
     * @constructor
     * @param {'partial' | 'following'} type 
     * @param {iterator} gen - an iterator which upon finishing, resolves with
     * a path for an agent to follow
     * @param {Array<PlanDetail>} steps 
     */
    constructor(type, gen, steps = []) {
        this.type = type;
        this.gen = gen;
        this.steps = steps;
    }
}

class NavigatingPerson {
    /**
     * @constructor
     * @param {Person} person 
     * @param {LMap} map 
     * @param {Array<{ getBoudningBox(): Bbox }>} objList 
     */
    constructor(person, map, objList) {
        this.person = person;
        this.map = map;
        this.objList = objList;
        this.plan = undefined;
        this._t = 0;
    }

    startPlanTo(goal) {
        this.plan = new Plan(
            'partial',
            this.constructPlan(goal, 400),
        );
    }

    step() {
        const plan = this.plan;
        if (!plan) {
            const goal = getRandomPersonLocationOnMap(this.map.getBoundingBox(), this.objList, 500);
            if (!goal) return;
            this.plan = new Plan(
                'partial',
                this.constructPlan(goal, 400),
            );
        } else if (plan.type === 'partial') {
            const rv = plan.gen.next();
            if (rv.done) {
                if (!rv.value) return this.plan = { type: 'none' };
                this.plan = new Plan(
                    'following',
                    undefined,
                    rv.value,
                );
            } else {
                plan.count++;
            }
        } else {
            const done = !plan.steps.length;
            if (!done) {
                const step = plan.steps.shift();
                this.person.setRenderConfiguration({
                    x: step.moveToX,
                    y: step.moveToY,
                    walkingFrameDelta: this._t,
                    directionAngle: step.facingAngle,
                });
                this._t += 0.1;
            } else {
                this.plan = undefined;
            }
        }
    }

    /**
     * @param {{ x: number, y: number }} goalPosition 
     * @param {number} iterationAttempts - the number of iterations before yielding
     */
    *constructPlan(goalPosition, iterationAttempts = 100) {
        const goalPos = new LV2(goalPosition.x, goalPosition.y);
        const start = {
            x: this.person.x,
            y: this.person.y,
            prev: null,
        };
        start.dist = goalPos.dist(start);
        const stack = [start];
        const visited = new Map([[`${start.x},${start.y}`, true]]);
        let tries = 0;
        while(stack.length) {
            for(let i = 0; i < iterationAttempts && stack.length; i++) {
                const stepSize = 2;
                // get nextState from stack
                const current = stack.shift();
                if (!current) continue;
                const dist = goalPos.dist(current);
                // while not reached goal
                const goalReached = dist < stepSize * 2;
                // if this is goal, return formulated plan
                if (goalReached) {
                    let ptr = current;
                    const list = [];
                    while(ptr) {
                        const detail = {
                            moveToX: ptr.x,
                            moveToY: ptr.y,
                            facingAngle: ptr.angle || 0,
                            animateWalk: true,
                        };
                        list.unshift(detail);
                        ptr = ptr.prev;
                    }
                    return list;
                }
                // else compute next states which have not been visited
                const otherPositions = getSurroundingPositions(current.x, current.y, stepSize)
                    .filter(state => {
                        const key = `${state.x},${state.y}`;
                        state.key = key;
                        if (visited.has(key)) return false;
                        state.dist = goalPos.dist(state);
                        const bbox = Person.createBoundingBox(state.x, state.y);
                        if (!bbox.within(this.map.getBoundingBox())) return false;
                        return !bbox.intersectsWithAnyObject(this.objList);
                    })
                    .map(state => {
                        state.prev = current;
                        visited.set(state.key, true);
                        return state;
                    });

                // add them to the stack
                stack.push(...otherPositions);
                stack.sort((a, b) => {
                    return a.dist - b.dist;
                });
            }
            yield tries++;
        }
        return null;
    }

}