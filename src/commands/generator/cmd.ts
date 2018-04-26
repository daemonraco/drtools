#!/usr/bin/env node

/**
 * @file cmd.ts
 * @author Alejandro D. Simi
 */

import { DRToolsGenerator } from './generator';

const generator: DRToolsGenerator = new DRToolsGenerator();
generator.run();
