/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @param {WebGLProgram} program
 */
function createShader(gl, type, source, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    gl.attachShader(program, shader);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {

    const program = gl.createProgram();

    console.log('about to work on vertex shader');
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource, program);
    console.log('about to work on fragment shader');
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource, program);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program); // how to indicate which program you plan to use (you can switch between WebGL programs) 
    return program;
}