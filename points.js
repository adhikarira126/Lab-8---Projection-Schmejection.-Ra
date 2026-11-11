// /** @type {typeof import("gl-matrix")} */

// const glm = glMatrix;

// const { mat4, mat3, vec4, vec3, vec2 } = glm;

class Points {

    points3D = [
        2, 1, -3,
        1, 2, -5
    ];

     points3DInsideViewVolume = []; // filled in by recalculatePointsNDC()

            pointsNDC = [];                // filled in by recalculatePointsNDC()

    render(projMat) {

        this.recalculatePointsNDC(projMat); // in case points have been added to points3D

        // create the buffer and look up the attribute only once, not on every render
        if (!this.vertexBuffer) {
            this.vertexBuffer = gl.createBuffer();
            this.aPositionLocation = gl.getAttribLocation(program, 'aPosition');
        }

        gl.clear(gl.COLOR_BUFFER_BIT); // erase the previous frame
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pointsNDC), gl.STATIC_DRAW); // fill the buffer

        gl.vertexAttribPointer(this.aPositionLocation, 3, gl.FLOAT, false, 3 * 4, 0); // how to read vertex data
        gl.enableVertexAttribArray(this.aPositionLocation); // enable the bound array as the source for aPosition

        gl.drawArrays(gl.POINTS, 0, this.numPoints());
    }

    // called by render() 
    recalculatePointsNDC(projMat) {
        this.pointsNDC = [];
        this.points3DInsideViewVolume = [];

        for (let j = 0; j < this.points3D.length; j += 3) {
            let x = this.points3D[j];
            let y = this.points3D[j + 1];
            let z = this.points3D[j + 2];

            // 1. homogeneous coordinates
            const pointHomogeneous = vec4.fromValues(x, y, z, 1);

            // 2. apply projMat -> clip coordinates
            const clip = vec4.transformMat4(vec4.create(), pointHomogeneous, projMat);

            // 3. perspective division -> NDC
            const xNDC = clip[0] / clip[3];
            const yNDC = clip[1] / clip[3];
            const zNDC = clip[2] / clip[3];

            // 4. visible only if all three NDC coords are in [-1, 1]
            const inRange = (v) => v >= -1 && v <= 1;
            this.points3DInsideViewVolume.push(inRange(xNDC) && inRange(yNDC) && inRange(zNDC));

            // 5. always store the NDC coords
            this.pointsNDC.push(xNDC, yNDC, zNDC);
        }
    }

    numPoints() {
        return this.points3D.length / 3;
    }
}