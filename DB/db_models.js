/**
 * Created by Ale on 30/04/2016.
 */

var knex = require('./config');
var Bookshelf = require('bookshelf')(knex);


var Rol;
var User;
var GraphicType;
var LoadedVisualization;
var Category;
var Filter;
var Department;
var PaymentType;
var Sale;
var Store;
var Province;


Rol = Bookshelf.Model.extend({
  tableName: 'roles',
  users: function(){
    return this.hasMany(User);
  }
});

User = Bookshelf.Model.extend({
  tableName: 'users',
  rol: function(){
    return this.belongsTo(Rol);
  },
  loaded_visualizations: function(){
    return this.hasMany(LoadedVisualization);
  }
});

GraphicType = Bookshelf.Model.extend({
  tableName: 'graphic_types',
  loaded_visualizations: function(){
    return this.hasMany(LoadedVisualization);
  },
  categories: function(){
    return this.belongsToMany(Category, 'categories_graphic_types');
  }
});

Category = Bookshelf.Model.extend({
  tableName: 'categories',
  graphic_types: function(){
    return this.belongsToMany(GraphicType, 'categories_graphic_types');
  },
  filters: function(){
    return this.hasMany(Filter);
  },
  loaded_visualizations: function(){
    return this.hasMany(LoadedVisualization);
  }
});

Filter = Bookshelf.Model.extend({
  tableName: 'filters',
  category: function(){
    return this.belongsTo(Category);
  },
  loaded_visualizations: function(){
    return this.belongsToMany(LoadedVisualization, 'loaded_visualizations_filters');
  }
});

LoadedVisualization = Bookshelf.Model.extend({
  tableName: 'loaded_visualizations',
  user: function(){
    return this.belongsTo(User);
  },
  category: function(){
    return this.belongsTo(Category);
  },
  graphic_type: function(){
    return this.belongsTo(GraphicType);
  },
  filters: function(){
    return this.belongsToMany(Filter, 'loaded_visualizations_filters');
  }
});

Department = Bookshelf.Model.extend({
  tableName: 'departments',
  sales: function(){
    return this.hasMany(Sale);
  }
});

PaymentType = Bookshelf.Model.extend({
  tableName: 'payment_types',
  sales: function(){
    return this.hasMany(Sale);
  }
});

Store = Bookshelf.Model.extend({
  tableName: 'stores',
  sales: function(){
    return this.hasMany(Sale);
  },
  province: function(){
    return this.belongsTo(Province);
  }
});

Province = Bookshelf.Model.extend({
  tableName: 'provinces',
  stores: function(){
    return this.hasMany(Store)
  }
});

Sale = Bookshelf.Model.extend({
  tableName: 'sales',
  department: function(){
    return this.belongsTo(Department);
  },
  payment_type: function(){
    return this.belongsTo(PaymentType);
  },
  store: function(){
    return this.belongsTo(Store)
  }
});


module.exports = {
  Rol: Rol,
  User: User,
  GraphicType: GraphicType,
  LoadedVisualization: LoadedVisualization,
  Category: Category,
  Filter: Filter,
  Department: Department,
  PaymentType: PaymentType,
  Sale: Sale,
  Store: Store,
  Province: Province
};