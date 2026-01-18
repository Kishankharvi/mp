import axios from 'axios';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

// Language mappings for Piston API
const languageMap = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    cpp: { language: 'cpp', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
    typescript: { language: 'typescript', version: '5.0.3' },
    go: { language: 'go', version: '1.16.2' },
    rust: { language: 'rust', version: '1.68.2' }
};

export const executeCode = async (language, code, stdin = '') => {
    try {
        const langConfig = languageMap[language] || languageMap.javascript;

        const response = await axios.post(`${PISTON_API_URL}/execute`, {
            language: langConfig.language,
            version: langConfig.version,
            files: [
                {
                    name: `main.${language === 'python' ? 'py' : language === 'java' ? 'java' : language}`,
                    content: code
                }
            ],
            stdin: stdin,
            args: [],
            compile_timeout: 10000,
            run_timeout: 3000,
            compile_memory_limit: -1,
            run_memory_limit: -1
        });

        return {
            success: true,
            output: response.data.run.output || '',
            stderr: response.data.run.stderr || '',
            stdout: response.data.run.stdout || '',
            code: response.data.run.code
        };
    } catch (error) {
        console.error('Code execution error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to execute code'
        };
    }
};

export const getSupportedLanguages = async () => {
    try {
        const response = await axios.get(`${PISTON_API_URL}/runtimes`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch supported languages:', error);
        return [];
    }
};
