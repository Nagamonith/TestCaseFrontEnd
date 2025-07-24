import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from 'src/app/shared/services/product.service';
import { TestCaseService } from 'src/app/shared/services/test-case.service';

import {
  faPlus, faCube, faCodeBranch, faList, faCheck, faTimes,
  faSave, faEdit, faTrash, faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

interface Module {
  id: string;
  name: string;
  editing?: boolean;
}

type PendingAction = 'addModule' | 'addVersion' | 'toggleModules' | null;

@Component({
  selector: 'app-extra-adds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extra-adds.component.html',
  styleUrls: ['./extra-adds.component.css']
})
export class ExtraAddsComponent implements OnInit {
  icons = {
    plus: faPlus,
    cube: faCube,
    codeBranch: faCodeBranch,
    list: faList,
    check: faCheck,
    times: faTimes,
    save: faSave,
    edit: faEdit,
    trash: faTrash,
    boxOpen: faBoxOpen
  };

  // Local state
  products = signal<Product[]>([]);
  selectedProductId = signal<string>('');
  newProductName = '';

  showAddProductForm = false;
  showProductSelectorModal = false;
  showAddModuleForm = false;
  showAddVersionForm = false;
  showModuleList = false;
  pendingAction: PendingAction = null;
  showProductList = false;

  newModuleName = '';
  newModuleVersion = 'v1.0';
  newVersionName = '';
  selectedModuleId = '';

  modules = signal<Module[]>([]);
  versionsByModule = computed(() => {
    const result: Record<string, string[]> = {};
    this.modules().forEach(mod => {
      result[mod.id] = this.testCaseService.getVersionsByModule(mod.id);
    });
    return result;
  });

  constructor(
    private productService: ProductService,
    private testCaseService: TestCaseService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products.set(products);
      if (!this.selectedProductId()) {
        this.selectedProductId.set(products[0]?.id || '');
      }
    });

    this.modules.set(this.testCaseService.getModules());
  }

  // Product methods
  getProductName(productId: string): string {
    return this.products().find(p => p.id === productId)?.name || 'Unknown Product';
  }

  addProduct() {
    const name = this.newProductName.trim();
    if (!name) return;

    this.productService.addProduct(name);
    this.newProductName = '';
    this.showAddProductForm = false;
  }

  // Module methods
  handleAddModule() {
    if (this.products().length === 0) {
      this.showAddProductForm = true;
      return;
    }
    this.pendingAction = 'addModule';
    this.showProductSelectorModal = true;
  }

  saveModule() {
    const name = this.newModuleName.trim();
    const version = this.newModuleVersion.trim() || 'v1.0';
    if (!name) {
      alert('Module name is required');
      return;
    }

    const newId = this.testCaseService.addModule(name, version);
    this.modules.set(this.testCaseService.getModules());

    this.resetModuleForm();
  }

  private resetModuleForm() {
    this.newModuleName = '';
    this.newModuleVersion = 'v1.0';
    this.showAddModuleForm = false;
  }

  startEditing(module: Module) {
    this.modules.update(mods =>
      mods.map(m => m.id === module.id ? { ...m, editing: true } : m)
    );
  }

  saveEditing(module: Module) {
    const name = module.name.trim();
    if (!name) {
      alert('Module name cannot be empty');
      return;
    }

    this.modules.update(mods =>
      mods.map(m => m.id === module.id ? { ...m, name, editing: false } : m)
    );
  }

  deleteModule(moduleId: string) {
    if (confirm('Are you sure you want to delete this module and all its versions?')) {
      this.modules.update(mods => mods.filter(m => m.id !== moduleId));
      // Note: TestCaseService doesn’t support module deletion
    }
  }

  // Version methods
  handleAddVersion() {
    if (this.modules().length === 0) {
      alert('Please add a module first');
      return;
    }
    this.pendingAction = 'addVersion';
    this.showProductSelectorModal = true;
  }

  saveVersion() {
    const version = this.newVersionName.trim();
    if (!this.selectedModuleId) {
      alert('Please select a module');
      return;
    }

    if (!version) {
      alert('Version name is required');
      return;
    }

    const existingVersions = this.versionsByModule()[this.selectedModuleId] || [];
    if (existingVersions.includes(version)) {
      alert('This version already exists for the selected module');
      return;
    }

    this.testCaseService.addVersion(this.selectedModuleId, version);
    this.resetVersionForm();
  }

  private resetVersionForm() {
    this.selectedModuleId = '';
    this.newVersionName = '';
    this.showAddVersionForm = false;
  }

  // Toggle modules
  handleToggleModules() {
    if (this.products().length === 0) {
      this.showAddProductForm = true;
      return;
    }
    this.pendingAction = 'toggleModules';
    this.showProductSelectorModal = true;
  }

  // Product selection
  confirmProductSelection() {
    if (!this.selectedProductId()) {
      alert('Please select a product');
      return;
    }

    this.showProductSelectorModal = false;

    switch (this.pendingAction) {
      case 'addModule':
        this.showAddModuleForm = true;
        break;
      case 'addVersion':
        this.showAddVersionForm = true;
        break;
      case 'toggleModules':
        this.showModuleList = !this.showModuleList;
        break;
    }

    this.pendingAction = null;
  }

  cancelProductSelection() {
    this.pendingAction = null;
    this.showProductSelectorModal = false;
  }
  
}
