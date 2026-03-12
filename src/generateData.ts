import * as fs from 'fs';

const projectsData = [
  { name: 'Nobi Dana Kripto', key: 'NDKT', templateId: '1', approval: true, tr: [5,2,3], tp: [1,1,2], ms: [1,1,1], def: 10 },
  { name: 'Akulaku', key: 'AKLK', templateId: '1', approval: false, tr: [2,3,5], tp: [2,4,2], ms: [1,1,2], def: 10 },
  { name: 'Traveloka', key: 'TVLK', templateId: '2', approval: true, tr: [5,2,3], tp: [1,1,2], ms: [1,1,1], def: 10 },
  { name: 'tokopedia', key: 'TKPD', templateId: '2', approval: false, tr: [5,2,3], tp: [1,1,2], ms: [1,1,1], def: 10 },
  { name: 'gojek', key: 'GJEK', templateId: '3', approval: true, tr: [5,2,3], tp: [1,1,2], ms: [1,1,1], def: 10 },
  { name: 'NOBI', key: 'NOBI', templateId: '3', approval: false, tr: [5,2,3], tp: [1,1,2], ms: [1,1,1], def: 10 },
  { name: 'Tokopedia Entertaiment', key: 'TE', templateId: '4', approval: true, tr: [5,2,3], tp: [4,1,2], ms: [1,2,1], def: 10 },
  { name: 'Tokopedia Wallet', key: 'TW', templateId: '4', approval: false, tr: [11,2,3], tp: [1,1,2], ms: [21,1,1], def: 10 },
  { name: 'NOBI Trade', key: 'NT', templateId: '5', approval: true, tr: [5,2,3], tp: [1,1,22], ms: [1,1,11], def: 10 },
  { name: 'Nobi Earn', key: 'NW', templateId: '5', approval: false, tr: [5,2,3], tp: [1,1,12], ms: [1,11,1], def: 10 },
  { name: 'AKULAKU Finance', key: 'NT-FIN', templateId: '6', approval: true, tr: [5,2,3], tp: [1,10,2], ms: [5,1,1], def: 10 },
  { name: 'AKULAKU Commerce', key: 'NW-COM', templateId: '6', approval: false, tr: [5,2,3], tp: [2,1,2], ms: [1,4,1], def: 10 },
];

const generatedProjects: any[] = [];
const generatedTestCases: any[] = [];
const generatedDirectories: any[] = [];

let prjIdCounter = 1;

projectsData.forEach(p => {
  const prjId = `PRJ-${prjIdCounter++}`;
  
  // Random users and groups
  const prjUsers = Array.from({length: 5}, () => `usr-${Math.floor(Math.random() * 20) + 1}`);
  const prjGroups = Array.from({length: 2}, () => `grp-${Math.floor(Math.random() * 5) + 1}`);
  
  const tcStatus = { draft: 0, under_review: 0, rejected: 0, ready: 0 };
  
  // Generate 5 directories for this project
  const dirs: string[] = [];
  for (let d = 1; d <= 5; d++) {
    const dirId = `dir-${prjId}-${d}`;
    dirs.push(dirId);
    generatedDirectories.push({
      id: dirId,
      projectId: prjId,
      name: `Directory ${d}`,
      description: `Description for directory ${d}`,
      parentId: null
    });
  }
  
  for (let i = 1; i <= 50; i++) {
    let status: 'draft' | 'under_review' | 'rejected' | 'ready' = 'ready';
    if (p.approval) {
      const r = Math.random();
      if (r < 0.2) status = 'draft';
      else if (r < 0.4) status = 'under_review';
      else if (r < 0.5) status = 'rejected';
      else status = 'ready';
    }
    
    tcStatus[status]++;
    
    generatedTestCases.push({
      id: `${p.key}-${i}`,
      projectId: prjId,
      title: `Test Case ${i} for ${p.name}`,
      type: 'Functional',
      priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
      status: 'Untested',
      reviewStatus: status === 'draft' ? 'Draft' : status === 'under_review' ? 'In Review' : status === 'rejected' ? 'Need Update' : 'Approved',
      assignee: prjUsers[Math.floor(Math.random() * prjUsers.length)],
      directory: dirs[Math.floor((i-1)/10)]
    });
  }
  
  generatedProjects.push({
    id: prjId,
    name: p.name,
    key: p.key,
    description: `Project for ${p.name}`,
    enable_test_case_approval: p.approval,
    test_cases: {
      total_test_cases: 50,
      status: tcStatus
    },
    test_runs: {
      total_test_runs: p.tr[0] + p.tr[1] + p.tr[2],
      status: { completed: p.tr[0], overdue: p.tr[1], open: p.tr[2] }
    },
    test_plans: {
      total_test_plans: p.tp[0] + p.tp[1] + p.tp[2],
      status: { completed: p.tp[0], overdue: p.tp[1], open: p.tp[2] }
    },
    milestones: {
      total_milestones: p.ms[0] + p.ms[1] + p.ms[2],
      status: { completed: p.ms[0], overdue: p.ms[1], open: p.ms[2] }
    },
    defects: {
      total_defects: p.def,
      status: { failed: 4, in_progress: 3, fixed: 2, in_testing: 1 }
    },
    test_case_templates: {
      id: p.templateId,
      name: `Template ${p.templateId}`,
      description: `Template ${p.templateId} description`
    },
    access_management: {
      users: {
        total_users: prjUsers.length,
        data: prjUsers.map(u => ({ id: u, name: `User ${u}`, email: `${u}@example.com` }))
      },
      groups: {
        total_groups: prjGroups.length,
        data: prjGroups.map(g => ({ id: g, name: `Group ${g}`, description: `Description ${g}` }))
      }
    }
  });
});

fs.writeFileSync('generated_data.json', JSON.stringify({
  projects: generatedProjects,
  testCases: generatedTestCases,
  directories: generatedDirectories
}, null, 2));
console.log('Done');
