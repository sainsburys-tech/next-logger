const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

describe('next.js logger object', () => {
  it('logs something', async () => {
    const script = `
      require('next/dist/build/output/log').error('Something went wrong')
    `
    const { stdout, stderr } = await execAsync(`node -r "." -e "${script}"`)

    expect(stderr).toBe('')
    expect(JSON.parse(stdout)).toMatchObject({
      level: 50,
      name: 'next.js',
      msg: 'Something went wrong',
      prefix: 'error',
    })
  })
})
