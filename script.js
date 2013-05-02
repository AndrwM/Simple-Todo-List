Parse.initialize("vHnDhzswuBwp3NC5NfJ0UC53j8gEhlhPkLN9Dz4f", "V47TFPNsg5vgakJJb03jgjUZZf9sZphGGVSEjIoX");

var Task = Parse.Object.extend('Task');

$(document).ready(function(){

  console.log('DocReady')
  
  taskListContainer = $('.js-task-list')
  taskListContainerCompleted = $('.js-task-list-completed')

  getTasks();

  $("a.js-clear-completed-tasks").on("click", function(event){
    taskDestroy()
    event.preventDefault()
  });

  $(".add-task a").on("click", function(event){
    var name = $('.add-task input').val();
    saveTask(name)
    $('.add-task input').val('');

  });

  console.log('getTasksFunction')

});

//------------------------------------------------

var getTasks = function() {

  console.log('getTasksFunction Initiated')

  var query = new Parse.Query(Task);

  query.find({
    success: function(results) {

      console.log('got: ' + results)

      allTasks = results

      renderTaskList(results);

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

};

//------------------------------------------------

var renderTaskList = function(tasks) {
  // console.log(recipes);
  // recipes.forEach(function(singleRecipe){ console.log(singleRecipe) });

  console.log(tasks)

  $('.js-task-list,.js-task-list-completed').find('li.task').remove();

  for (var i = 0; ( i < tasks.length ); i++) {
    // console.log(i)

    var id = tasks[i].id
    var taskName = tasks[i].get('task')
    var completed = tasks[i].get('completed')
    var deleteButton = '<a href="#" class="delete">Delete</a>'
    var completedButton = '<a href="#" class="complete">I did it!</a>'

    if (completed) {

      var rendered = '<li id="'+ id +'" class="task"><span>'+ taskName + '</span>' + deleteButton + '</li>'

      taskListContainerCompleted.append(rendered);

    } else {

      var rendered = '<li id="'+ id +'" class="task"><span>'+ taskName + '</span>' + completedButton + deleteButton + '</li>'

      taskListContainer.append(rendered);

    }

    console.log(id,taskName,completed)

  }

  $("a.delete").on("click", function(event){
      
    var id = $(this).parent().attr('id')
    taskDestroy(id);
    event.preventDefault()

  });

  $("a.complete").on("click", function(event){
    
    console.log(this)
    var id = $(this).parent().attr('id')
    saveTask(null,true,id);
    event.preventDefault()
    
  });

};

//------------------------------------------------

var taskDestroy = function(taskId) {

  console.log('taskDestroy Function Ran')

  if (taskId) {

    console.log('accepted task ID')

    var task = $.grep(allTasks, function(e){ return e.id == taskId; });

    task[0].destroy({
      success: function(query){
        
        console.log('removed' + taskId);
        $('#' + taskId).remove()

      },
      error: function(query, error){

        console.warn('remove failed' + taskId);

      }
    });

  } else {

    var tasks = $.grep(allTasks, function(e){ return e.attributes.completed == true; });
    console.log(tasks)

    for (var i = 0; ( i < tasks.length ); i++) {

      tasks[i].destroy({
        success: function(query){

          console.log('removed');
          $('.js-task-list-completed li').remove()

        },
        error: function(query, error){

          console.warn('remove failed');

        }
      });
    }


  }

};

//------------------------------------------------

var saveTask = function(name,completed,id){

  if (completed) {

    var task = $.grep(allTasks, function(e){ return e.id == id; });
    console.log(task)

    task[0].set('completed', true);

    task[0].save(null, {

      success: function(result) {
        console.log('saved')

        console.log(allTasks)

        renderTaskList(allTasks)

      },

      error: function(result, error) {
        console.log('save failed')

      }

    });

  } else {

    console.log(name,completed)
        
    var task = new Task();
     
    task.set('task', name);
    task.set('completed', completed);

    console.log(task)
     
    task.save(null, {

      success: function(result) {
        console.log('saved')

        allTasks.push(task)

        console.log(allTasks)

        renderTaskList(allTasks)

      },

      error: function(result, error) {
        console.log('save failed')

      }

    });

  }

};

