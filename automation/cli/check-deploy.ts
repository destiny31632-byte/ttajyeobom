import { deploymentProblems } from '../lib/deploy-settings.ts';
const problems = deploymentProblems(process.env);
if (problems.length) {
  problems.forEach((problem) => console.error(problem));
  process.exitCode = 1;
} else console.log('배포 설정 형식 확인. 무료 계정·실제 연락처 운영 여부는 별도 확인 필요.');
