
var code=[];
for(var i=1;i<=sessionStorage.length;i++){
  code.push(sessionStorage.getItem("code"+i));
}

const USER_MENU = [
  {path: 'pages',
  children: [
  {
    path: 'live_room',
    code : "9999",
    data: {
      menu: {
        title: 'Live Room',
        icon: 'fa fa-video-camera',
        selected: false,
        expanded: false,
        order: 40
      }
    },
    children: [
      {
        code : "9999",
      }
    ],
  }
  ]}
];


/* const PAGE_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        code: '9999',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            code : "9999",
          }
        ],
      },

      
      {
        path: 'class_room',
        code : "1027",
        data: {
          menu: {
            title: 'Class Room',
            icon: 'fa fa-video-camera',
            selected: false,
            expanded: false,
            order: 40
          }
        },
        children: [
          {
            code : "9999",
          }
        ],
      },
      {
        path: 'account',
        code : "1000",
        data: {
          menu: {
            title: 'Accounts',
            icon: 'fa fa-bank',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'profile',
            code: '1000',
            data: {
              menu: {
                title: 'Manage Profile'
              }
            }
          },
          {
            path: 'general_info',
            code : "1001",
            data: {
              menu: {
                title: 'General Info'
              }
            }
          },
          {
            path: 'view_profile',
            code : "1002",
            data: {
              menu: {
                title: 'View Profile'
              }
            }
          }
        ]
      },
      {
        path: '',
        code : "1004",
        data: {
          menu: {
            title: 'Users',
            icon: 'fa fa-user',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/pages/users'],
            code : "1004",
            data: {
              menu: {
                title: 'Users'
              }
            }
          },
          {
            path: ['/pages/groups'],
            code : "1005",
            data: {
              menu: {
                title: 'Groups'
              }
            }
          }
        ]
      },
      {
        path: 'manage_courses',
        code : "1007",
        data: {
          menu: {
            title: 'Courses',
            icon: 'fa fa-book',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: 'courses',
            code : "1007",
            data: {
              menu: {
                title: 'All Courses'
              }
            }
          },
          {
            path: 'my_courses',
            code : "1025",
            data: {
              menu: {
                title: 'My Courses'
              }
            }
          }
        ]
      },
      {
        path: '',
        code : "1022",
        data: {
          menu: {
            title: 'Assesments',
            icon: 'ion-clipboard',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/pages/exams'],
            code : "1009",
            data: {
              menu: {
                title: 'Quizzes'
              }
            }
          },
          {
            path: ['/pages/examToTake'],
            code : "1010",
            data: {
              menu: {
                title: 'Quizzes'
              }
            }
          }
        ]
      },
      {
        path: '',
        code : "1012",
        data: {
          menu: {
            title: 'Attendance',
            icon: 'ion-document-text',
            selected: false,
            expanded: false,
            order: 650,
          },
        },
        children: [
          {
            path: ['/pages/attendence'],
            code : "1012",
            data: {
              menu: {
                title: 'Attendance List'
              }
            }
          },
        ]
      },
      {
        path: '',
        code : "1014",
        data: {
          menu: {
            title: 'Schedule',
            icon: 'ion-grid',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/pages/timetable'],
            code : "1013",
            data: {
              menu: {
                title: 'Classes'
              }
            }
          },
           {
            path: ['/pages/datesheet'],
            code : "1013",
            data: {
              menu: {
                title: 'Assesments'
              }
            }
          },
          {
            path: ['/pages/calendar'],
            code : "1014",
            data: {
              menu: {
                title: 'Calendar'
              }
            }
          }
        ]
      },
      {
        path: '',
        code : "1016",
        data: {
          menu: {
            title: 'Assignments',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/pages/assignment'],
            code : "1016",
            data: {
              menu: {
                title: 'Assignments'
              }
            }
          }
        ]
      },
      {
        path: '',
        code : "1019",
        data: {
          menu: {
            title: 'Services',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/pages/services'],
            code : "1019",
            data: {
              menu: {
                title: 'Services'
              }
            }
          }
        ]
      }, 
      {
        path: '',
        code : "1023",
        data: {
          menu: {
            title: 'Grades',
            icon: 'ion-ios-compose-outline',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/pages/grades'],
            code : "1023",
            data: {
              menu: {
                title: 'Grades'
              }
            }
          }
        ]
      },
      {
        path: 'batches',
        code : "1021",
        data: {
          menu: {
            title: 'Batches',
            icon: 'ion-bookmark',
            selected: false,
            expanded: false,
            order: 500,
          }
        },
        children: [
          {
            path: '',
            code : "1021",
            data: {
              menu: {
                title: 'All Batches'
              }
            }
          }
        ]
      }
    ]
  }
]; */

/* PAGE_MENU[0].children.filter(function(item){
  for(var i=0;i<code.length;i++){
    if(item.code==code[i]){
      for(var j=0; j < item.children.length; j++){
        var matchOne=false;
        code.forEach(function(serviceCode){
          if(item.children[j].code==serviceCode){
            matchOne=true;
          }
        });
        if(!matchOne){
          item.children.splice(j,1);
        }
      }
      for(var j=0; j < item.children.length; j++){
        var matchOne=false;
        code.forEach(function(serviceCode){
          if(item.children[j].code==serviceCode){
            matchOne=true;
          }
        });
        if(!matchOne){
          item.children.splice(j,1);
        }
      }
      USER_MENU[0].children.push(item);
    }
  }
  
}); */

export const PAGES_MENU=[];